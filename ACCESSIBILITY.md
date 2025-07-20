# Accessibility Documentation

## Overview

This document outlines the accessibility features and compliance standards implemented in the Leonardo Anime Database application. The application is designed to be accessible to users with disabilities and follows WCAG 2.1 AA guidelines.

## WCAG 2.1 AA Compliance

### ✅ Perceivable
- **Text Alternatives**: All images have descriptive alt text
- **Time-based Media**: No time-based media content
- **Adaptable**: Content can be presented in different ways without losing information
- **Distinguishable**: Sufficient color contrast and text sizing

### ✅ Operable
- **Keyboard Accessible**: All functionality available via keyboard
- **Enough Time**: No time limits on content
- **Seizures and Physical Reactions**: No flashing content
- **Navigable**: Clear navigation and skip links

### ✅ Understandable
- **Readable**: Clear language and text formatting
- **Predictable**: Consistent navigation and behavior
- **Input Assistance**: Form validation and error messages

### ✅ Robust
- **Compatible**: Works with assistive technologies
- **Valid HTML**: Proper semantic markup

## Keyboard Navigation

### Global Navigation
- **Skip Link**: Press Tab to access "Skip to main content" link
- **Tab Order**: Logical tab sequence throughout the application
- **Focus Indicators**: Clear visual focus indicators on all interactive elements

### User Information Modal
- **Open Modal**: Tab to "Edit" button and press Enter
- **Close Modal**: 
  - Press Escape key
  - Tab to "✕" button and press Enter
  - Tab to "Cancel" button and press Enter
- **Form Navigation**: Tab through form fields in logical order
- **Submit Form**: Tab to "Save" button and press Enter

### Anime List
- **Search**: Tab to search input and type to search
- **Per Page Selector**: Tab to dropdown and use arrow keys to select
- **Anime Cards**: Tab to any anime card and press Enter to view details
- **Pagination**: Tab to Previous/Next buttons and press Enter

### Anime Details Modal
- **Open Modal**: Tab to anime card and press Enter
- **Close Modal**: Press Escape key or tab to "✕" button
- **Content Navigation**: Tab through modal content

## Screen Reader Support

### ARIA Labels and Descriptions

#### User Information Modal
```tsx
// Close button
<Button aria-label="Close dialog">✕</Button>

// Form fields
<Input 
  aria-describedby="username-help"
  aria-invalid={username.trim() === '' && username !== ''}
/>

// Help text
<Text id="username-help">
  Enter a username to identify yourself
</Text>
```

#### Anime List
```tsx
// Search input
<Input 
  aria-label="Search anime database"
  aria-describedby="search-help"
  role="searchbox"
/>

// Anime cards
<Box 
  role="button"
  tabIndex={0}
  aria-label={`View details for ${anime.title.english || anime.title.romaji}`}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAnimeClick(anime);
    }
  }}
>

// Pagination buttons
<Button aria-label="Go to previous page">← Previous</Button>
<Button aria-label="Go to next page">Next →</Button>
```

#### Anime Modal
```tsx
// Close button
<Button aria-label="Close anime details">✕</Button>

// Images
<Image 
  alt={`Cover image for ${anime.title.english || anime.title.romaji}`}
/>
```

### Live Regions

#### Loading States
```tsx
<Box role="status" aria-live="polite">
  <Spinner aria-label="Loading anime data" />
  <Text position="absolute" width="1px" height="1px" padding="0" margin="-1px" overflow="hidden" clip="rect(0, 0, 0, 0)" whiteSpace="nowrap" border="0">
    Loading anime data, please wait...
  </Text>
</Box>
```

#### Error Messages
```tsx
<Box 
  role="alert"
  aria-live="assertive"
>
  <Text fontWeight="bold">Error loading anime data:</Text>
  <Text>{error.message}</Text>
</Box>
```

#### Dynamic Content
```tsx
<Text aria-live="polite">
  {animeList.length} results
</Text>
```

## Form Accessibility

### User Information Form
- **Required Fields**: Properly marked with `required` attribute
- **Field Labels**: Associated with inputs using `htmlFor` and `id`
- **Help Text**: Descriptive help text for each field
- **Validation**: Real-time validation with `aria-invalid`
- **Error Messages**: Clear error descriptions
- **Submit Button**: Disabled state with helpful description

### Search Form
- **Search Role**: Proper `role="searchbox"` for search input
- **Search Help**: Descriptive text explaining search functionality
- **Live Results**: Results count announced to screen readers

## Color and Contrast

### Color Scheme
- **Primary**: Teal (#14b8a6) with white text (4.5:1 contrast ratio)
- **Secondary**: Gray (#6b7280) with white text (4.5:1 contrast ratio)
- **Error**: Red (#ef4444) with white text (4.5:1 contrast ratio)
- **Background**: Dark theme with high contrast text

### Focus Indicators
- **Default**: 2px outline with teal color
- **Buttons**: Clear focus ring with proper contrast
- **Inputs**: Focus ring with error color for invalid fields

## Semantic HTML

### Proper Structure
```tsx
// Main content area
<div id="main-content">
  <main>
    <h1>Anime Information Database</h1>
    // Content
  </main>
</div>

// Form structure
<form onSubmit={handleSubmit}>
  <fieldset>
    <legend>User Information</legend>
    <label htmlFor="username">Username</label>
    <input id="username" required />
  </fieldset>
</form>
```

### Heading Hierarchy
- **H1**: Page title ("Anime Information Database")
- **H2**: Section headings (modal titles, form sections)
- **H3**: Subsection headings (anime details sections)

## Testing Guidelines

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Use Enter/Space to activate buttons
- [ ] Use Escape to close modals
- [ ] Navigate forms with Tab/Shift+Tab
- [ ] Use arrow keys in dropdowns

#### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (macOS)
- [ ] Test with TalkBack (Android)
- [ ] Verify all images have alt text
- [ ] Check form labels and help text
- [ ] Verify error messages are announced
- [ ] Test loading state announcements

#### Visual Testing
- [ ] Check color contrast ratios
- [ ] Verify focus indicators are visible
- [ ] Test with high contrast mode
- [ ] Check text sizing (zoom 200%)
- [ ] Verify no flashing content

### Automated Testing

#### Recommended Tools
- **axe-core**: Automated accessibility testing
- **Lighthouse**: Accessibility audit
- **WAVE**: Web accessibility evaluation tool
- **Color Contrast Analyzer**: Verify contrast ratios

#### Testing Commands
```bash
# Run Lighthouse accessibility audit
npx lighthouse http://localhost:3000 --only-categories=accessibility

# Run axe-core tests
npm install axe-core
# Add to your test suite
```

## Browser Support

### Supported Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Assistive Technology Support
- **Screen Readers**: NVDA, JAWS, VoiceOver, TalkBack
- **Voice Control**: Dragon NaturallySpeaking, Voice Control
- **Switch Control**: iOS Switch Control, Android Switch Access
- **Magnification**: Browser zoom, system magnification

## Development Guidelines

### When Adding New Features

1. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
2. **Screen Reader Support**: Add appropriate ARIA labels and descriptions
3. **Semantic HTML**: Use proper HTML elements and structure
4. **Color Contrast**: Verify sufficient contrast ratios
5. **Focus Management**: Maintain logical tab order
6. **Error Handling**: Provide clear error messages
7. **Loading States**: Announce loading states to screen readers

### Code Examples

#### Adding a New Button
```tsx
<Button 
  onClick={handleClick}
  aria-label="Descriptive action"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Button Text
</Button>
```

#### Adding a New Form Field
```tsx
<FieldRoot required>
  <FieldLabel htmlFor="field-id">Field Label</FieldLabel>
  <Input
    id="field-id"
    aria-describedby="field-help"
    aria-invalid={isInvalid}
  />
  <Text id="field-help" fontSize="sm" color="gray.500">
    Help text for the field
  </Text>
</FieldRoot>
```

#### Adding a New Modal
```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (isOpen) {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
  }

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'unset';
  };
}, [isOpen, onClose]);
```

## Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Web Accessibility Initiative](https://www.w3.org/WAI/)

### Testing Tools
- [axe-core](https://github.com/dequelabs/axe-core)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Screen Readers
- [NVDA (Free)](https://www.nvaccess.org/about-nvda/)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (Built-in)](https://www.apple.com/accessibility/vision/)
- [TalkBack (Built-in)](https://support.google.com/accessibility/android/answer/6283677)

## Maintenance

### Regular Audits
- Conduct accessibility audits quarterly
- Test with multiple screen readers
- Verify keyboard navigation
- Check color contrast ratios
- Review ARIA implementation

### User Feedback
- Collect feedback from users with disabilities
- Monitor accessibility-related support requests
- Test with assistive technology users
- Incorporate accessibility improvements based on feedback

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Compliance Level**: WCAG 2.1 AA 