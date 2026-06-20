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

const openCalendly = (): void => {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url: business.calendlyUrl });
    return;
  }

  window.open(business.calendlyUrl, "_blank", "noopener,noreferrer");
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
  resetWaitlist();
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

const setupPage = (): void => {
  byId("year")!.textContent = new Date().getFullYear().toString();
  document.querySelectorAll("[data-calendly]").forEach((button) => {
    button.addEventListener("click", openCalendly);
  });

  setupReadMore();
  setupWaitlist();
  setupForms();
  setupChat();
  setupMobileNav();
};

setupPage();
