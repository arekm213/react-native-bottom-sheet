---
id: overview
title: Usage
sidebar_position: 1
slug: /usage
---

# Usage

The library provides two components: `BottomSheet` (inline) and
`ModalBottomSheet` (modal). Both render their children as the sheet content,
with a `surface` prop for the background behind it, and are controlled via
`detents`, `index`, and `onIndexChange`. Use `onSettle` to observe when the
sheet finishes moving.
