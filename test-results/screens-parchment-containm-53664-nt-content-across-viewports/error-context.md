# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: screens.spec.js >> parchment containment >> child elements are contained within parchment-content across viewports
- Location: tests/screens.spec.js:131:3

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - heading "El amuleto del tiempo" [level=1] [ref=e3]
  - banner:
    - button "Toggle Audio" [ref=e4] [cursor=pointer]: 🔊
  - main [ref=e5]:
    - main [ref=e6]:
      - heading "El amuleto del tiempo" [level=1] [ref=e9]
      - toolbar "Story start actions" [ref=e10]:
        - button "Iniciar aventura" [ref=e11] [cursor=pointer]
  - contentinfo
```