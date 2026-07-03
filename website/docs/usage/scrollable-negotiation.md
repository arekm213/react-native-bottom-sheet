---
id: scrollable-negotiation
title: Scrollable negotiation
sidebar_position: 6
---

# Scrollable negotiation

By default, the sheet coordinates vertical gestures with nested scrollables,
such as `ScrollView` and `FlatList`.

If you want gestures that start inside a nested scrollable to stay with that
scrollable even when it cannot scroll any further, set
`disableScrollableNegotiation`:

```tsx
<BottomSheet
  index={index}
  onIndexChange={setIndex}
  surface={/* ... */}
  disableScrollableNegotiation
>
  {/* ... */}
</BottomSheet>
```
