import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { IconButton, PaginationDots, Section, Surface, TagList } from "@/components/ds";
import SceneBackground from "@/components/scene/SceneBackground";
import ProfileCarousel from "@/components/ProfileCarousel";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { sectionIndex } from "@/data/navigation";

describe("Design system primitives", () => {
  it("Section renders a numbered, labelled heading", () => {
    render(
      <Section id="about" index={sectionIndex("about")} title="About Me" description="Short intro">
        <p>Body</p>
      </Section>,
    );

    const region = screen.getByRole("region", { name: /about me/i });
    expect(region).toHaveAttribute("id", "about");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("01About Me");
    expect(screen.getByText("Short intro")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("TagList renders a labelled list", () => {
    render(<TagList items={["Go", "Kafka"]} label="Stack" />);
    const list = screen.getByRole("list", { name: "Stack" });
    expect(list.querySelectorAll("li")).toHaveLength(2);
  });

  it("Surface renders the requested element and tracks the pointer when interactive", () => {
    render(
      <Surface as="article" interactive data-testid="card">
        Card
      </Surface>,
    );
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("ARTICLE");
    expect(card).toHaveClass("spotlight");
    // jsdom has no PointerEvent; a MouseEvent of the same type carries the coordinates.
    fireEvent(card, new MouseEvent("pointermove", { bubbles: true, clientX: 20, clientY: 10 }));
    expect(card.style.getPropertyValue("--spot-x")).toBe("20px");
  });

  it("IconButton defaults to type=button and supports asChild links", () => {
    render(
      <>
        <IconButton aria-label="Next">›</IconButton>
        <IconButton asChild aria-label="GitHub">
          <a href="https://github.com">gh</a>
        </IconButton>
      </>,
    );
    expect(screen.getByRole("button", { name: "Next" })).toHaveAttribute("type", "button");
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).not.toHaveAttribute("type");
    expect(link.className).toContain("inline-flex");
  });

  it("PaginationDots marks the active tab and reports selection", () => {
    const onSelect = vi.fn();
    render(
      <PaginationDots count={3} active={1} onSelect={onSelect} label="Slides" getItemLabel={(i) => `Slide ${i + 1}`} />,
    );
    expect(screen.getByRole("tab", { name: "Slide 2" })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(screen.getByRole("tab", { name: "Slide 3" }));
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});

describe("SceneBackground", () => {
  it("falls back to the 2D canvas when WebGL 2 is unavailable", () => {
    const { container } = render(<SceneBackground />);
    expect(screen.queryByTestId("webgl-background")).not.toBeInTheDocument();
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });
});

describe("Reduced motion", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.useRealTimers();
  });

  const renderCarousel = () =>
    render(
      <LanguageProvider defaultLanguage="pt">
        <ProfileCarousel />
      </LanguageProvider>,
    );

  it("autoplays the photo carousel by default", () => {
    vi.useFakeTimers();
    renderCarousel();
    expect(screen.getByText("Perfil")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("Instrutor & Palestras")).toBeInTheDocument();
  });

  it("stops autoplay when the user prefers reduced motion", () => {
    window.matchMedia = ((query: string) => ({
      ...originalMatchMedia(query),
      matches: query.includes("prefers-reduced-motion"),
    })) as typeof window.matchMedia;
    vi.useFakeTimers();
    renderCarousel();
    act(() => vi.advanceTimersByTime(15000));
    expect(screen.getByText("Perfil")).toBeInTheDocument();
  });
});
