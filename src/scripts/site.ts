import { business } from "../content/site";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

const byId = <T extends HTMLElement>(id: string): T | null => document.getElementById(id) as T | null;

const encodeMailto = (subject: string, body: string): string => {
  return `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const openCalendly = (url = business.calendlyUrl): void => {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url });
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
};

type AvailabilitySlot = {
  label: string;
  schedulingUrl: string;
};

const setupAvailability = async (): Promise<void> => {
  const availability = document.querySelector<HTMLElement>("[data-availability]");
  const slotsContainer = document.querySelector<HTMLElement>("[data-availability-slots]");
  if (!availability || !slotsContainer) return;

  availability.hidden = false;

  try {
    const response = await fetch("/api/availability");
    if (!response.ok) {
      availability.hidden = true;
      return;
    }

    const data = (await response.json()) as { slots?: AvailabilitySlot[] };
    const slots = data.slots?.filter((slot) => slot.label && slot.schedulingUrl) ?? [];
    if (slots.length === 0) {
      availability.hidden = true;
      return;
    }

    slotsContainer.replaceChildren(
      ...slots.map((slot) => {
        const button = document.createElement("button");
        button.className = "slot";
        button.type = "button";
        button.textContent = slot.label;
        button.addEventListener("click", () => openCalendly(slot.schedulingUrl));
        return button;
      }),
    );
  } catch {
    availability.hidden = true;
    return;
  }
};

const showWaitlistStep = (step: 1 | 2 | 3): void => {
  [1, 2, 3].forEach((index) => {
    const element = byId<HTMLElement>(`waitlistStep${index}`);
    if (element) {
      element.hidden = index !== step;
    }
  });
};

const resetWaitlist = (): void => {
  showWaitlistStep(1);
  byId<HTMLInputElement>("waitlistName")!.value = "";
  byId<HTMLInputElement>("waitlistEmail")!.value = "";
  byId<HTMLTextAreaElement>("waitlistAnswer")!.value = "";
};

const openModal = (id: string): void => byId(id)?.classList.add("open");

const closeModal = (id: string): void => {
  byId(id)?.classList.remove("open");
  if (id === "waitlistModal") {
    resetWaitlist();
  } else if (id === "giftCardModal") {
    resetGiftCard();
  }
};

const setupReadMore = (): void => {
  const button = byId<HTMLButtonElement>("readMoreBtn");
  const text = byId<HTMLElement>("readMoreText");
  if (!button || !text) return;

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    text.hidden = expanded;
    button.textContent = expanded ? "(read more)" : "(read less)";
  });
};

const setupWaitlist = (): void => {
  document.querySelectorAll<HTMLElement>("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.openModal!));
  });

  document.querySelectorAll<HTMLElement>("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => closeModal(button.dataset.closeModal!));
  });

  document.querySelectorAll<HTMLElement>(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  document.querySelector("[data-waitlist-next]")?.addEventListener("click", () => {
    const name = byId<HTMLInputElement>("waitlistName")?.value.trim();
    const email = byId<HTMLInputElement>("waitlistEmail")?.value.trim();
    if (!name || !email) {
      alert("Please fill in your name and email to continue.");
      return;
    }
    showWaitlistStep(2);
  });

  document.querySelector("[data-waitlist-back]")?.addEventListener("click", () => showWaitlistStep(1));

  document.querySelector("[data-waitlist-submit]")?.addEventListener("click", () => {
    const name = byId<HTMLInputElement>("waitlistName")?.value.trim() ?? "";
    const email = byId<HTMLInputElement>("waitlistEmail")?.value.trim() ?? "";
    const answer = byId<HTMLTextAreaElement>("waitlistAnswer")?.value.trim() ?? "";
    window.location.href = encodeMailto(
      "Matrescence Circles waitlist",
      `Name: ${name}\nEmail: ${email}\n\nWhat challenges are you facing, or what would you like to get out of a circle with other mothers?\n${answer}`,
    );
    showWaitlistStep(3);
  });
};

const setupForms = (): void => {
  document.querySelector<HTMLFormElement>("[data-signup-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  byId<HTMLFormElement>("contactForm")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = byId<HTMLInputElement>("contactName")?.value.trim() ?? "";
    const message = byId<HTMLTextAreaElement>("contactMessage")?.value.trim() ?? "";
    window.location.href = encodeMailto("New message from the Kindr website", `Name: ${name}\n\n${message}`);
    this.querySelector<HTMLElement>(".form-fields")!.hidden = true;
    this.querySelector<HTMLElement>(".modal-success")!.classList.add("show");
  });
};

const setupChat = (): void => {
  document.querySelectorAll("[data-chat-toggle]").forEach((button) => {
    button.addEventListener("click", () => byId("chatBox")?.classList.toggle("open"));
  });

  document.querySelector("[data-chat-send]")?.addEventListener("click", () => {
    const messageInput = byId<HTMLTextAreaElement>("chatMessage");
    const message = messageInput?.value.trim();
    if (!message) return;

    window.location.href = encodeMailto("Quick question from the Kindr website", message);
    byId("chatSuccess")?.classList.add("show");
    if (messageInput) {
      messageInput.value = "";
    }
  });
};

const setupMobileNav = (): void => {
  const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const mobileNav = document.querySelector<HTMLElement>("[data-mobile-nav]");
  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", () => {
    mobileNav.hidden = !mobileNav.hidden;
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.hidden = true;
    });
  });
};

const resetGiftCard = (): void => {
  const step1 = byId("giftCardStep1");
  const step2 = byId("giftCardStep2");
  if (step1) step1.hidden = false;
  if (step2) step2.hidden = true;

  const customWrapper = byId("customAmountWrapper");
  if (customWrapper) customWrapper.hidden = true;

  const emailInput = byId<HTMLInputElement>("giftEmail");
  if (emailInput) emailInput.value = "";

  const customInput = byId<HTMLInputElement>("giftCustomAmount");
  if (customInput) customInput.value = "";

  document.querySelectorAll("#giftCardModal .btn-choice").forEach((btn, idx) => {
    if (idx === 0) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
};

const setupGiftCard = (): void => {
  document.querySelectorAll<HTMLButtonElement>("#giftCardModal .btn-choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#giftCardModal .btn-choice").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const amount = btn.dataset.amount || "";

      const customWrapper = byId("customAmountWrapper");
      if (customWrapper) {
        customWrapper.hidden = amount !== "custom";
      }
    });
  });

  document.querySelector("[data-gift-submit]")?.addEventListener("click", () => {
    const email = byId<HTMLInputElement>("giftEmail")?.value.trim() ?? "";

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    const selectedAmount =
      document.querySelector<HTMLButtonElement>("#giftCardModal .btn-choice.active")?.dataset.amount ?? "80";
    let finalAmount = selectedAmount;
    if (selectedAmount === "custom") {
      const customAmount = byId<HTMLInputElement>("giftCustomAmount")?.value.trim() ?? "";
      if (!customAmount) {
        alert("Please enter a custom amount.");
        return;
      }
      finalAmount = customAmount;
    }

    window.location.href = encodeMailto(
      "Kindr gift card request",
      `Hi Janet,\n\nI would like to buy a Kindr gift card.\n\nMy email: ${email}\nAmount: $${finalAmount}\n\nPlease send through bank details so I can complete the purchase.\n\nThank you!`,
    );

    const step1 = byId("giftCardStep1");
    const step2 = byId("giftCardStep2");
    if (step1) step1.hidden = true;
    if (step2) step2.hidden = false;
  });
};

const setupPage = (): void => {
  const yearEl = byId("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
  document.querySelectorAll<HTMLElement>("[data-calendly]").forEach((button) => {
    button.addEventListener("click", () => openCalendly());
  });
  void setupAvailability();

  setupReadMore();
  setupWaitlist();
  setupGiftCard();
  setupForms();
  setupChat();
  setupMobileNav();
};

setupPage();
