# Decisions

Append-only, ADR-style (spec 7.9): one entry per decision, newest last. A later entry for the same path supersedes an earlier one; nothing is edited or deleted. set_by is chosen, confirmed_default, auto_default, assumed, delegated, reference, asset or standard.

## D-0001 · init with defaults
- set_by: auto_default · locked: no · date: 2026-11-09 · supersedes: none · source_ref: none
- reason: Start of the design system; every default traces to references/levers.json.

## D-0002 · answers.Q-plat-01 = ["web"]
- set_by: assumed · locked: no · date: 2026-11-09 · supersedes: none · source_ref: none
- reason: read from the files (HTML pages); say if that's wrong
- also set: raw.platforms = ["web"] (from Q-plat-01)

## D-0003 · raw.brandColor = "#007aff"
- set_by: assumed · locked: no · date: 2026-11-09 · supersedes: none · source_ref: none
- reason: read from the code: the colour the CSS uses most on focus, token (3 uses, high confidence); say if that's wrong

## D-0004 · raw.textFace = "IBM Plex Sans Thai"
- set_by: assumed · locked: no · date: 2026-11-09 · supersedes: none · source_ref: none
- reason: read from the font the CSS names most (18 font-family rules); say if that's wrong
- previous value: "system"

## D-0005 · answers.Q-theme-01 = "system-light-dark"
- set_by: assumed · locked: no · date: 2026-11-09 · supersedes: none · source_ref: none
- reason: read from prefers-color-scheme: dark in index.html; say if that's wrong
- also set: raw.flags.darkMode = true (from Q-theme-01)
- also set: raw.defaultTheme = "system" (from Q-theme-01)

## D-0006 · answers.Q-scope-07 = "near-launch"
- set_by: assumed · locked: no · date: 2026-11-09 · supersedes: none · source_ref: none
- reason: read from the repo: code and deploy settings (netlify.toml), but no released version yet; say if that's wrong

## D-0007 · House standards v4: 291 applied
- set_by: standard · locked: yes · date: 2026-11-09 · supersedes: none · source_ref: standards.json v4
- reason: OpenDesigner's house standards (sources marked non-negotiable) are applied without asking and locked. Change one only when the person asks: engine.py standard override <id> --why "<their words>".
- <details><summary>291 standards</summary> STD-when-to-animate-01, STD-when-to-animate-03, STD-when-to-animate-04, STD-when-to-animate-05, STD-when-to-animate-06, STD-when-to-animate-07, STD-when-to-animate-08, STD-when-to-animate-09, STD-when-to-animate-10, STD-when-to-animate-11, STD-when-to-animate-13, STD-when-to-animate-15, STD-when-to-animate-16, STD-when-to-animate-17, STD-when-to-animate-20, STD-when-to-animate-22, STD-easing-duration-01, STD-easing-duration-02, STD-easing-duration-03, STD-easing-duration-06, STD-easing-duration-07, STD-easing-duration-09, STD-easing-duration-10, STD-easing-duration-11, STD-easing-duration-12, STD-easing-duration-13, STD-easing-duration-15, STD-easing-duration-17, STD-easing-duration-19, STD-enter-exit-origin-01, STD-enter-exit-origin-02, STD-enter-exit-origin-03, STD-enter-exit-origin-04, STD-enter-exit-origin-06, STD-enter-exit-origin-08, STD-enter-exit-origin-09, STD-enter-exit-origin-10, STD-enter-exit-origin-11, STD-enter-exit-origin-12, STD-enter-exit-origin-13, STD-enter-exit-origin-16, STD-enter-exit-origin-17, STD-enter-exit-origin-21, STD-enter-exit-origin-23, STD-enter-exit-origin-24, STD-enter-exit-origin-26, STD-enter-exit-origin-27, STD-enter-exit-origin-28, STD-enter-exit-origin-29, STD-enter-exit-origin-30, STD-enter-exit-origin-31, STD-enter-exit-origin-37, STD-enter-exit-origin-38, STD-enter-exit-origin-39, STD-enter-exit-origin-40, STD-enter-exit-origin-41, STD-enter-exit-origin-42, STD-enter-exit-origin-43, STD-enter-exit-origin-44, STD-springs-gestures-01, STD-springs-gestures-02, STD-springs-gestures-04, STD-springs-gestures-05, STD-springs-gestures-06, STD-springs-gestures-07, STD-springs-gestures-08, STD-springs-gestures-09, STD-springs-gestures-11, STD-springs-gestures-12, STD-springs-gestures-13, STD-springs-gestures-14, STD-springs-gestures-15, STD-springs-gestures-16, STD-springs-gestures-17, STD-springs-gestures-18, STD-springs-gestures-19, STD-springs-gestures-20, STD-springs-gestures-21, STD-springs-gestures-25, STD-springs-gestures-26, STD-springs-gestures-28, STD-springs-gestures-30, STD-springs-gestures-34, STD-springs-gestures-39, STD-springs-gestures-41, STD-springs-gestures-42, STD-springs-gestures-45, STD-springs-gestures-59, STD-springs-gestures-60, STD-springs-gestures-61, STD-springs-gestures-63, STD-performance-properties-01, STD-performance-properties-02, STD-performance-properties-06, STD-performance-properties-09, STD-performance-properties-10, STD-performance-properties-11, STD-performance-properties-12, STD-performance-properties-13, STD-performance-properties-14, STD-performance-properties-15, STD-performance-properties-16, STD-performance-properties-17, STD-performance-properties-24, STD-performance-properties-25, STD-accessibility-motion-01, STD-accessibility-motion-02, STD-accessibility-motion-05, STD-accessibility-motion-06, STD-accessibility-motion-07, STD-accessibility-motion-08, STD-accessibility-motion-09, STD-accessibility-motion-10, STD-accessibility-motion-11, STD-accessibility-motion-12, STD-accessibility-motion-13, STD-accessibility-motion-15, STD-accessibility-motion-16, STD-accessibility-motion-17, STD-accessibility-motion-18, STD-accessibility-motion-20, STD-accessibility-motion-23, STD-accessibility-motion-24, STD-accessibility-motion-26, STD-accessibility-motion-27, STD-components-toasts-drawers-03, STD-components-toasts-drawers-07, STD-components-toasts-drawers-10, STD-components-toasts-drawers-11, STD-components-toasts-drawers-12, STD-components-toasts-drawers-13, STD-components-toasts-drawers-14, STD-components-toasts-drawers-15, STD-components-toasts-drawers-16, STD-components-toasts-drawers-17, STD-components-toasts-drawers-18, STD-components-toasts-drawers-25, STD-components-toasts-drawers-29, STD-components-toasts-drawers-30, STD-components-toasts-drawers-33, STD-components-toasts-drawers-34, STD-components-toasts-drawers-37, STD-components-toasts-drawers-40, STD-components-toasts-drawers-44, STD-components-toasts-drawers-45, STD-components-toasts-drawers-48, STD-components-toasts-drawers-65, STD-components-toasts-drawers-72, STD-components-toasts-drawers-77, STD-mobile-touch-02, STD-mobile-touch-03, STD-mobile-touch-05, STD-mobile-touch-06, STD-mobile-touch-07, STD-mobile-touch-08, STD-mobile-touch-09, STD-mobile-touch-10, STD-mobile-touch-11, STD-mobile-touch-13, STD-mobile-touch-14, STD-mobile-touch-15, STD-mobile-touch-16, STD-mobile-touch-17, STD-mobile-touch-18, STD-mobile-touch-19, STD-mobile-touch-20, STD-mobile-touch-21, STD-mobile-touch-24, STD-mobile-touch-28, STD-mobile-touch-70, STD-visual-details-01, STD-visual-details-02, STD-visual-details-03, STD-visual-details-04, STD-visual-details-05, STD-visual-details-06, STD-visual-details-07, STD-visual-details-08, STD-visual-details-09, STD-visual-details-10, STD-visual-details-11, STD-visual-details-13, STD-visual-details-14, STD-visual-details-15, STD-visual-details-16, STD-visual-details-17, STD-visual-details-18, STD-visual-details-19, STD-visual-details-20, STD-visual-details-21, STD-visual-details-24, STD-visual-details-25, STD-visual-details-26, STD-visual-details-27, STD-visual-details-28, STD-visual-details-29, STD-visual-details-30, STD-visual-details-31, STD-visual-details-32, STD-visual-details-33, STD-visual-details-34, STD-visual-details-35, STD-visual-details-36, STD-visual-details-37, STD-visual-details-38, STD-visual-details-39, STD-visual-details-40, STD-visual-details-41, STD-visual-details-42, STD-visual-details-43, STD-visual-details-44, STD-visual-details-45, STD-visual-details-46, STD-visual-details-47, STD-visual-details-48, STD-visual-details-49, STD-visual-details-50, STD-visual-details-51, STD-visual-details-55, STD-visual-details-56, STD-visual-details-57, STD-visual-details-59, STD-visual-details-64, STD-process-review-taste-01, STD-process-review-taste-02, STD-process-review-taste-03, STD-process-review-taste-04, STD-process-review-taste-05, STD-process-review-taste-06, STD-process-review-taste-07, STD-process-review-taste-08, STD-process-review-taste-09, STD-process-review-taste-10, STD-process-review-taste-11, STD-process-review-taste-12, STD-process-review-taste-13, STD-process-review-taste-14, STD-process-review-taste-15, STD-process-review-taste-16, STD-process-review-taste-17, STD-process-review-taste-18, STD-process-review-taste-19, STD-process-review-taste-20, STD-process-review-taste-21, STD-process-review-taste-22, STD-process-review-taste-23, STD-process-review-taste-24, STD-process-review-taste-25, STD-process-review-taste-26, STD-process-review-taste-27, STD-process-review-taste-28, STD-process-review-taste-29, STD-process-review-taste-30, STD-process-review-taste-31, STD-process-review-taste-32, STD-process-review-taste-33, STD-process-review-taste-34, STD-process-review-taste-35, STD-process-review-taste-36, STD-process-review-taste-37, STD-process-review-taste-38, STD-process-review-taste-39, STD-process-review-taste-40, STD-process-review-taste-41, STD-process-review-taste-42, STD-process-review-taste-43, STD-process-review-taste-44, STD-process-review-taste-45, STD-process-review-taste-46, STD-process-review-taste-47, STD-process-review-taste-48, STD-process-review-taste-49, STD-process-review-taste-50, STD-process-review-taste-51, STD-process-review-taste-52, STD-process-review-taste-53, STD-process-review-taste-54, STD-process-review-taste-55, STD-process-review-taste-56, STD-process-review-taste-57, STD-process-review-taste-58, STD-process-review-taste-59, STD-process-review-taste-60, STD-process-review-taste-62, STD-process-review-taste-63, STD-process-review-taste-64, STD-process-review-taste-65, STD-process-review-taste-66, STD-process-review-taste-67, STD-visual-details-65, STD-visual-details-66</details>
- STD-when-to-animate-01: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-03: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-04: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-05: motion.duration.instant = 0ms
- STD-when-to-animate-06: followed; it sets no values (DESIGN.md and review carry it)
- STD-when-to-animate-07: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-08: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-09: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-10: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-11: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-13: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-15: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-16: followed; it sets no values
- STD-when-to-animate-17: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-20: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-22: followed; it sets no values
- STD-easing-duration-01: motion.easing.linear = [0, 0, 1, 1]
- STD-easing-duration-01: motion.easing.hover = [0.25, 0.1, 0.25, 1]
- STD-easing-duration-02: motion.easing.enter = [0.23, 1, 0.32, 1]
- STD-easing-duration-02: motion.easing.exit = [0.23, 1, 0.32, 1]
- STD-easing-duration-02: motion.easing.standard = [0.77, 0, 0.175, 1]
- STD-easing-duration-03: followed; it sets no values (DESIGN.md and review carry it)
- STD-easing-duration-06: followed; it sets no values (DESIGN.md and review carry it)
- STD-easing-duration-07: motion.duration.micro = 100ms
- STD-easing-duration-07: motion.duration.short = 150ms
- STD-easing-duration-07: motion.duration.medium = 200ms
- STD-easing-duration-07: motion.duration.long = 250ms
- STD-easing-duration-09: followed; it sets no values (DESIGN.md carries it)
- STD-easing-duration-10: followed; it sets no values (DESIGN.md carries it)
- STD-easing-duration-11: followed; it sets no values (DESIGN.md carries it)
- STD-easing-duration-12: followed; it sets no values (DESIGN.md carries it)
- STD-easing-duration-13: followed; it sets no values (DESIGN.md carries it)
- STD-easing-duration-15: followed; it sets no values (DESIGN.md carries it)
- STD-easing-duration-17: followed; it sets no values (DESIGN.md carries it)
- STD-easing-duration-19: followed; it sets no values
- STD-enter-exit-origin-01: motion.scale.enter = 0.95
- STD-enter-exit-origin-02: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-03: followed; it sets no values (DESIGN.md and review carry it)
- STD-enter-exit-origin-04: followed; it sets no values (DESIGN.md and review carry it)
- STD-enter-exit-origin-06: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-08: motion.duration.medium = 200ms
- STD-enter-exit-origin-08: motion.scale.enter = 0.95
- STD-enter-exit-origin-09: motion.duration.tooltip = 125ms
- STD-enter-exit-origin-09: motion.scale.enter-tooltip = 0.97
- STD-enter-exit-origin-10: motion.duration.instant = 0ms
- STD-enter-exit-origin-11: motion.duration.modal = 250ms
- STD-enter-exit-origin-11: motion.scale.enter-modal = 0.96
- STD-enter-exit-origin-12: motion.duration.modal = 250ms
- STD-enter-exit-origin-13: motion.duration.stagger = 50ms
- STD-enter-exit-origin-16: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-17: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-21: followed; it sets no values (DESIGN.md and review carry it)
- STD-enter-exit-origin-23: motion.duration.medium = 200ms
- STD-enter-exit-origin-24: followed; it sets no values (DESIGN.md and review carry it)
- STD-enter-exit-origin-26: motion.duration.reveal = 600ms
- STD-enter-exit-origin-27: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-28: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-29: motion.blur.crossfade = 2px
- STD-enter-exit-origin-30: followed; it sets no values (DESIGN.md and review carry it)
- STD-enter-exit-origin-31: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-37: followed; it sets no values
- STD-enter-exit-origin-38: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-39: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-40: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-41: motion.easing.drawer = [0.32, 0.72, 0, 1]
- STD-enter-exit-origin-41: motion.duration.drawer = 500ms
- STD-enter-exit-origin-42: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-43: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-44: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-01: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-02: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-04: motion.spring.spatial.dampingRatio = 1.0
- STD-springs-gestures-04: motion.spring.spatial.stiffness = 246.7
- STD-springs-gestures-05: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-06: motion.spring.momentum = {"dampingRatio": 0.8, "stiffness": 246.7, "mass": 1}
- STD-springs-gestures-07: followed; it sets no values (DESIGN.md and review carry it)
- STD-springs-gestures-08: motion.spring.sheet = {"dampingRatio": 0.8, "stiffness": 438.6, "mass": 1}
- STD-springs-gestures-09: motion.spring.rotation = {"dampingRatio": 0.8, "stiffness": 246.7, "mass": 1}
- STD-springs-gestures-11: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-12: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-13: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-14: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-15: followed; it sets no values (DESIGN.md and review carry it)
- STD-springs-gestures-16: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-17: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-18: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-19: motion.gesture.deceleration-rate = 0.998
- STD-springs-gestures-20: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-21: motion.gesture.dismiss-velocity = 0.11
- STD-springs-gestures-25: motion.gesture.rubberband-constant = 0.55
- STD-springs-gestures-26: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-28: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-30: motion.gesture.direction-threshold = 10px
- STD-springs-gestures-34: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-39: followed; it sets no values (DESIGN.md and review carry it)
- STD-springs-gestures-41: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-42: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-45: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-59: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-60: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-61: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-63: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-01: followed; it sets no values (DESIGN.md and review carry it)
- STD-performance-properties-02: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-06: followed; it sets no values (DESIGN.md and review carry it)
- STD-performance-properties-09: followed; it sets no values (DESIGN.md and review carry it)
- STD-performance-properties-10: followed; it sets no values (DESIGN.md and review carry it)
- STD-performance-properties-11: followed; it sets no values (DESIGN.md and review carry it)
- STD-performance-properties-12: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-13: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-14: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-15: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-16: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-17: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-24: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-25: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-01: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-02: raw.reducedMotion = "replace"
- STD-accessibility-motion-02: motion.duration.reduced-fade = 200ms
- STD-accessibility-motion-02: reduced:motion.transition.enter = {"duration": "{motion.duration.reduced-fade}", "delay": {"value": 0, "unit": "ms"}, "timingFunction": [0.25, 0.1, 0.25, 1]}
- STD-accessibility-motion-02: reduced:motion.transition.exit = {"duration": "{motion.duration.reduced-fade}", "delay": {"value": 0, "unit": "ms"}, "timingFunction": [0.25, 0.1, 0.25, 1]}
- STD-accessibility-motion-02: reduced:motion.transition.expand = {"duration": "{motion.duration.reduced-fade}", "delay": {"value": 0, "unit": "ms"}, "timingFunction": [0.25, 0.1, 0.25, 1]}
- STD-accessibility-motion-05: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-06: followed; it sets no values
- STD-accessibility-motion-07: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-08: followed; it sets no values (DESIGN.md and review carry it)
- STD-accessibility-motion-09: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-10: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-11: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-12: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-13: followed; it sets no values (DESIGN.md and review carry it)
- STD-accessibility-motion-15: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-16: followed; it sets no values (DESIGN.md and review carry it)
- STD-accessibility-motion-17: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-18: followed; it sets no values
- STD-accessibility-motion-20: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-23: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-24: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-26: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-27: followed; it sets no values (DESIGN.md and review carry it)
- STD-components-toasts-drawers-03: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-07: motion.duration.toast = 400ms
- STD-components-toasts-drawers-07: motion.easing.toast = [0.25, 0.1, 0.25, 1]
- STD-components-toasts-drawers-10: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-11: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-12: component.toast.gap = 14px
- STD-components-toasts-drawers-13: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-14: component.toast.visible = 3
- STD-components-toasts-drawers-15: component.toast.duration = 4000ms
- STD-components-toasts-drawers-16: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-17: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-18: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-25: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-29: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-30: component.toast.offset.desktop = 32px
- STD-components-toasts-drawers-30: component.toast.offset.mobile = 16px
- STD-components-toasts-drawers-33: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-34: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-37: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-40: motion.easing.drawer = [0.32, 0.72, 0, 1]
- STD-components-toasts-drawers-44: motion.gesture.drag-lock-after-scroll = 100ms
- STD-components-toasts-drawers-45: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-48: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-65: followed; it sets no values
- STD-components-toasts-drawers-72: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-77: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-02: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-03: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-05: motion.scale.press = 0.97
- STD-mobile-touch-05: motion.duration.micro = 100ms
- STD-mobile-touch-06: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-07: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-08: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-09: size.target.touch = 44px
- STD-mobile-touch-09: size.target.min = 44px
- STD-mobile-touch-10: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-11: font.size.input = 16px
- STD-mobile-touch-13: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-14: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-15: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-16: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-17: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-18: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-19: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-20: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-21: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-24: followed; it sets no values
- STD-mobile-touch-28: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-70: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-01: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-02: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-03: followed; it sets no values (DESIGN.md and review carry it)
- STD-visual-details-04: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-05: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-06: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-07: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-08: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-09: followed; it sets no values (DESIGN.md and review carry it)
- STD-visual-details-10: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-11: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-13: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-14: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-15: followed; it sets no values (DESIGN.md and review carry it)
- STD-visual-details-16: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-17: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-18: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-19: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-20: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-21: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-24: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-25: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-26: followed; it sets no values (DESIGN.md and review carry it)
- STD-visual-details-27: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-28: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-29: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-30: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-31: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-32: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-33: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-34: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-35: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-36: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-37: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-38: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-39: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-40: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-41: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-42: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-43: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-44: followed; it sets no values
- STD-visual-details-45: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-46: followed; it sets no values
- STD-visual-details-47: followed; it sets no values
- STD-visual-details-48: followed; it sets no values
- STD-visual-details-49: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-50: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-51: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-55: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-56: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-57: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-59: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-64: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-01: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-02: followed; it sets no values
- STD-process-review-taste-03: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-04: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-05: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-06: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-07: followed; it sets no values
- STD-process-review-taste-08: followed; it sets no values
- STD-process-review-taste-09: followed; it sets no values
- STD-process-review-taste-10: followed; it sets no values
- STD-process-review-taste-11: followed; it sets no values
- STD-process-review-taste-12: followed; it sets no values
- STD-process-review-taste-13: followed; it sets no values
- STD-process-review-taste-14: followed; it sets no values
- STD-process-review-taste-15: followed; it sets no values
- STD-process-review-taste-16: followed; it sets no values
- STD-process-review-taste-17: followed; it sets no values
- STD-process-review-taste-18: followed; it sets no values
- STD-process-review-taste-19: followed; it sets no values
- STD-process-review-taste-20: followed; it sets no values
- STD-process-review-taste-21: followed; it sets no values
- STD-process-review-taste-22: followed; it sets no values
- STD-process-review-taste-23: followed; it sets no values
- STD-process-review-taste-24: followed; it sets no values
- STD-process-review-taste-25: followed; it sets no values
- STD-process-review-taste-26: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-27: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-28: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-29: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-30: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-31: followed; it sets no values
- STD-process-review-taste-32: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-33: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-34: followed; it sets no values
- STD-process-review-taste-35: followed; it sets no values
- STD-process-review-taste-36: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-37: followed; it sets no values
- STD-process-review-taste-38: followed; it sets no values
- STD-process-review-taste-39: followed; it sets no values
- STD-process-review-taste-40: followed; it sets no values (review carries it)
- STD-process-review-taste-41: followed; it sets no values (review carries it)
- STD-process-review-taste-42: followed; it sets no values
- STD-process-review-taste-43: followed; it sets no values
- STD-process-review-taste-44: followed; it sets no values
- STD-process-review-taste-45: followed; it sets no values
- STD-process-review-taste-46: followed; it sets no values
- STD-process-review-taste-47: followed; it sets no values
- STD-process-review-taste-48: followed; it sets no values
- STD-process-review-taste-49: followed; it sets no values
- STD-process-review-taste-50: followed; it sets no values
- STD-process-review-taste-51: followed; it sets no values
- STD-process-review-taste-52: followed; it sets no values
- STD-process-review-taste-53: followed; it sets no values
- STD-process-review-taste-54: followed; it sets no values
- STD-process-review-taste-55: followed; it sets no values
- STD-process-review-taste-56: followed; it sets no values
- STD-process-review-taste-57: followed; it sets no values
- STD-process-review-taste-58: followed; it sets no values
- STD-process-review-taste-59: followed; it sets no values
- STD-process-review-taste-60: followed; it sets no values
- STD-process-review-taste-62: followed; it sets no values
- STD-process-review-taste-63: followed; it sets no values
- STD-process-review-taste-64: followed; it sets no values
- STD-process-review-taste-65: followed; it sets no values
- STD-process-review-taste-66: followed; it sets no values
- STD-process-review-taste-67: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-65: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-66: followed; it sets no values (DESIGN.md carries it)

## D-0008 · answers.Q-aud-01 = "dense"
- set_by: delegated · locked: no · date: 2026-11-09 · supersedes: none · source_ref: none
- reason: sketch: picked for them
- also set: dials.density = 80 (from Q-aud-01)

## D-0009 · defaults.work-tool = ["corners", "weights", "surfaces"]
- set_by: auto_default · locked: no · date: 2026-11-09 · supersedes: none · source_ref: DC-L23-01
- reason: Dense work tool defaults for what you have not answered, set or locked (Q-aud-01 = dense). Confirm or change any of them like any other answer.
- corners: Controls 6px, cards and panels 8px, dialogs and popovers 12px [DC-L23-02, DC-L09-01]
- weights: Three weights: body 400, labels, column headers and row titles 500, headings 600 [DC-L23-03, DC-L02-15]
- surfaces: Static cards and panels separate by a 1px ring with no shadow; shadows stay on menus, popovers, dialogs and toasts [DC-L23-05, DC-L04-10]

## D-0010 · context.audience = "people who use it all day for work, in screens full of data"
- set_by: delegated · locked: no · date: 2026-11-09 · supersedes: none · source_ref: none
- reason: sketch: plain words for Q-aud-01, picked for them
- previous value: ""

## D-0011 · raw.brandColor = "#c94e17"
- set_by: chosen · locked: no · date: 2026-11-09 · supersedes: D-0003 · source_ref: none
- reason: sketch: Level 0 answer
- previous value: "#007aff"

## D-0012 · answers.Q-plat-01 = ["web"]
- set_by: delegated · locked: no · date: 2026-11-09 · supersedes: D-0002 · source_ref: none
- reason: sketch: picked for them
- previous value: ["web"]
- also set: raw.platforms = ["web"] (from Q-plat-01)

## D-0013 · raw.stack = ["svelte"]
- set_by: chosen · locked: no · date: 2026-11-09 · supersedes: none · source_ref: none
- reason: sketch: the code stack the person named

## D-0014 · macros = ["deferential", "minimal"]
- set_by: delegated · locked: no · date: 2026-11-09 · supersedes: none · source_ref: none
- reason: sketch: picked for them (feel words: calm, minimal)
- previous value: []

## D-0015 · taste.feelWords = ["calm", "minimal"]
- set_by: delegated · locked: no · date: 2026-11-09 · supersedes: none · source_ref: none
- reason: sketch: feel words picked for them

## D-0016 · answers.Q-theme-01 = "light-dark-toggle"
- set_by: delegated · locked: no · date: 2026-11-09 · supersedes: D-0005 · source_ref: none
- reason: sketch: picked for them
- previous value: "system-light-dark"
- also set: raw.flags.darkMode = true (from Q-theme-01)
- also set: raw.defaultTheme = "system" (from Q-theme-01)

## D-0017 · answers.Q-scope-06 = ["app:operate"]
- set_by: delegated · locked: no · date: 2026-11-09 · supersedes: none · source_ref: none
- reason: sketch: picked for them
- also set: context.surfaces = [{"name": "app", "mode": "Operate"}] (from Q-scope-06)
- also set: raw.productType = "work-tool" (from Q-scope-06)
- also set: raw.marketingSurfaces = false (from Q-scope-06)

## D-0018 · dials.roundness = 19
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: from reference cei-app-declared (high confidence): most common control radius 2 -> A5 band

## D-0019 · defaults.work-tool = ["weights", "surfaces"]
- set_by: auto_default · locked: no · date: 2026-11-09 · supersedes: D-0009 · source_ref: DC-L23-01
- reason: Dense work tool defaults for what you have not answered, set or locked (Q-aud-01 = dense). Confirm or change any of them like any other answer.
- weights: Three weights: body 400, labels, column headers and row titles 500, headings 600 [DC-L23-03, DC-L02-15]
- surfaces: Static cards and panels separate by a 1px ring with no shadow; shadows stay on menus, popovers, dialogs and toasts [DC-L23-05, DC-L04-10]
- no longer a default: corners (the roundness dial is set)

## D-0020 · dials.density = 60
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: from reference cei-app-declared (high confidence): body 15.0px -> A3 bands
- previous value: 80

## D-0021 · dials.depth = 56
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: from reference cei-app-declared (high confidence): shadow-ladder, median shadow strength 0.08 (alpha weighted by softness) -> A6 bands

## D-0022 · defaults.work-tool = ["weights"]
- set_by: auto_default · locked: no · date: 2026-11-09 · supersedes: D-0019 · source_ref: DC-L23-01
- reason: Dense work tool defaults for what you have not answered, set or locked (Q-aud-01 = dense). Confirm or change any of them like any other answer.
- weights: Three weights: body 400, labels, column headers and row titles 500, headings 600 [DC-L23-03, DC-L02-15]
- no longer a default: surfaces (the depth dial is set)

## D-0023 · dials.colorfulness = 83
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: from reference cei-app-declared (high confidence): top accent HCT chroma 70.8, 2 distinct accent hue(s) -> A7 anchors

## D-0024 · dials.warmth = 45
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: from reference cei-app-declared (high confidence): neutral tint chroma 0.005 at hue 286.0 -> A8 anchors

## D-0025 · raw.baseSize = 15
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: from reference cei-app-declared (high confidence): type scale fit base 15.0

## D-0026 · raw.spaceUnit = 4
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: from reference cei-app-declared (high confidence): largest of 4/5/8 dividing most values ({'8': 0.26, '5': 0.13, '4': 0.51})
- previous value: 4

## D-0027 · overrides.light:color.surface.base = {"colorSpace": "srgb", "components": [0.9137, 0.902, 0.8824], "hex": "#e9e6e1"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: background

## D-0028 · overrides.dark:color.surface.base = {"colorSpace": "srgb", "components": [0.0353, 0.0353, 0.0431], "hex": "#09090b"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: background

## D-0029 · overrides.light:color.surface.raised = {"colorSpace": "srgb", "components": [1.0, 1.0, 1.0], "hex": "#ffffff"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: card

## D-0030 · overrides.dark:color.surface.raised = {"colorSpace": "srgb", "components": [0.0941, 0.0941, 0.1059], "hex": "#18181b"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: card

## D-0031 · overrides.light:color.surface.overlay = {"colorSpace": "srgb", "components": [1.0, 1.0, 1.0], "hex": "#ffffff"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: popover

## D-0032 · overrides.dark:color.surface.overlay = {"colorSpace": "srgb", "components": [0.1098, 0.1098, 0.1176], "hex": "#1c1c1e"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: popover

## D-0033 · overrides.light:color.surface.sunken = {"colorSpace": "srgb", "components": [0.9451, 0.9373, 0.9216], "hex": "#f1efeb"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: muted

## D-0034 · overrides.dark:color.surface.sunken = {"colorSpace": "srgb", "components": [0.1412, 0.1412, 0.1529], "hex": "#242427"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: muted

## D-0035 · overrides.light:color.text.primary = {"colorSpace": "srgb", "components": [0.1098, 0.1098, 0.1176], "hex": "#1c1c1e"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: foreground

## D-0036 · overrides.dark:color.text.primary = {"colorSpace": "srgb", "components": [1.0, 1.0, 1.0], "hex": "#ffffff"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: foreground

## D-0037 · overrides.light:color.text.secondary = {"colorSpace": "srgb", "components": [0.3882, 0.3882, 0.4], "hex": "#636366"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: muted-foreground

## D-0038 · overrides.dark:color.text.secondary = {"colorSpace": "srgb", "components": [0.5961, 0.5961, 0.6235], "hex": "#98989f"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: muted-foreground

## D-0039 · overrides.light:color.bg.brand = {"colorSpace": "srgb", "components": [0.7882, 0.3059, 0.0902], "hex": "#c94e17"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: primary

## D-0040 · overrides.dark:color.bg.brand = {"colorSpace": "srgb", "components": [0.7882, 0.3059, 0.0902], "hex": "#c94e17"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: primary

## D-0041 · overrides.light:color.bg.action.primary = {"colorSpace": "srgb", "components": [0.7882, 0.3059, 0.0902], "hex": "#c94e17"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: primary

## D-0042 · overrides.dark:color.bg.action.primary = {"colorSpace": "srgb", "components": [0.7882, 0.3059, 0.0902], "hex": "#c94e17"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: primary

## D-0043 · overrides.light:color.text.on-brand = {"colorSpace": "srgb", "components": [1.0, 1.0, 1.0], "hex": "#ffffff"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: primary-foreground

## D-0044 · overrides.dark:color.text.on-brand = {"colorSpace": "srgb", "components": [1.0, 1.0, 1.0], "hex": "#ffffff"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: primary-foreground

## D-0045 · overrides.light:color.text.on-action = {"colorSpace": "srgb", "components": [1.0, 1.0, 1.0], "hex": "#ffffff"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: primary-foreground

## D-0046 · overrides.dark:color.text.on-action = {"colorSpace": "srgb", "components": [1.0, 1.0, 1.0], "hex": "#ffffff"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: primary-foreground

## D-0047 · overrides.light:color.bg.danger.bold = {"colorSpace": "srgb", "components": [0.7686, 0.2667, 0.1725], "hex": "#c4442c"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: destructive

## D-0048 · overrides.dark:color.bg.danger.bold = {"colorSpace": "srgb", "components": [1.0, 0.4196, 0.3608], "hex": "#ff6b5c"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: destructive

## D-0049 · overrides.light:color.text.on-danger = {"colorSpace": "srgb", "components": [1.0, 1.0, 1.0], "hex": "#ffffff"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: destructive-foreground

## D-0050 · overrides.dark:color.text.on-danger = {"colorSpace": "srgb", "components": [0.1098, 0.1098, 0.1176], "hex": "#1c1c1e"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: destructive-foreground

## D-0051 · overrides.light:color.border.default = {"colorSpace": "srgb", "components": [0.8667, 0.8471, 0.8196], "hex": "#ddd8d1"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: border

## D-0052 · overrides.dark:color.border.default = {"colorSpace": "srgb", "components": [0.1725, 0.1725, 0.1882], "hex": "#2c2c30"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: border

## D-0053 · overrides.light:color.border.input = {"colorSpace": "srgb", "components": [0.4588, 0.4588, 0.4588], "hex": "#757575"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: input

## D-0054 · overrides.dark:color.border.input = {"colorSpace": "srgb", "components": [0.502, 0.502, 0.502], "hex": "#808080"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: input

## D-0055 · overrides.light:color.border.focus = {"colorSpace": "srgb", "components": [0.0, 0.4784, 1.0], "hex": "#007aff"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: ring

## D-0056 · overrides.dark:color.border.focus = {"colorSpace": "srgb", "components": [0.0392, 0.5176, 1.0], "hex": "#0a84ff"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: ring

## D-0057 · overrides.light:color.border.danger = {"colorSpace": "srgb", "components": [0.7686, 0.2667, 0.1725], "hex": "#c4442c"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: destructive

## D-0058 · overrides.dark:color.border.danger = {"colorSpace": "srgb", "components": [1.0, 0.4196, 0.3608], "hex": "#ff6b5c"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: destructive

## D-0059 · overrides.light:color.bg.neutral.subtle = {"colorSpace": "srgb", "components": [0.898, 0.898, 0.9176], "hex": "#e5e5ea"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: secondary

## D-0060 · overrides.dark:color.bg.neutral.subtle = {"colorSpace": "srgb", "components": [0.1725, 0.1725, 0.1804], "hex": "#2c2c2e"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: secondary

## D-0061 · overrides.light:color.border.strong = {"colorSpace": "srgb", "components": [0.4588, 0.4588, 0.4588], "hex": "#757575"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: strong-border

## D-0062 · overrides.dark:color.bg.neutral.subtle-hover = {"colorSpace": "srgb", "components": [0.1725, 0.1725, 0.1804], "hex": "#2c2c2e"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: hover

## D-0063 · overrides.dark:color.bg.neutral.subtle-pressed = {"colorSpace": "srgb", "components": [0.1412, 0.1412, 0.1529], "hex": "#242427"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: pressed

## D-0064 · overrides.dark:color.bg.action.primary-hover = {"colorSpace": "srgb", "components": [0.7137, 0.2745, 0.0784], "hex": "#b64614"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: hover

## D-0065 · overrides.dark:color.bg.action.primary-pressed = {"colorSpace": "srgb", "components": [0.6, 0.2196, 0.0392], "hex": "#99380a"}
- set_by: reference · locked: no · date: 2026-11-09 · supersedes: none · source_ref: cei-app-declared
- reason: match app.css: pressed

## D-0066 · project standard PRJ-01 (non-negotiable): Course category colours are a fixed CEI extension: core #0f76d6, elective #6b50f0, gened #0a6e7a, each with four deterministic shades. Use them only on course bars, with white text and a text category tag; never for chrome or status.
- set_by: standard · locked: no · date: 2026-11-09 · supersedes: none · source_ref: person, 2026-11-09
- reason: Returning users navigate by a stable course colour; the palette sits outside the three accent roles.
