import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for marquee drag-to-select functionality in profile lists
 */
export function useProfileDragSelect({ contentContainerRef, selectedProfiles, setSelectedProfiles }) {
  const [dragBox, setDragBox] = useState(null);
  const dragInfoRef = useRef({
    isDown: false,
    isDragging: false,
    startX: 0,
    startY: 0,
    initialSelected: [],
    wasBlankClick: false
  });
  const selectedProfilesRef = useRef(selectedProfiles);

  useEffect(() => {
    selectedProfilesRef.current = selectedProfiles;
  }, [selectedProfiles]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragInfoRef.current.isDown) return;

      const { startX, startY, isDragging, initialSelected } = dragInfoRef.current;
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);

      if (!isDragging) {
        if (dx < 5 && dy < 5) return;
        dragInfoRef.current.isDragging = true;
      }

      // Prevent native text selection while dragging
      try {
        window.getSelection()?.removeAllRanges();
      } catch (err) {
        // ignore
      }

      // Auto-scroll container when dragging near top/bottom
      const container = contentContainerRef.current;
      if (container) {
        const cRect = container.getBoundingClientRect();
        if (e.clientY < cRect.top + 45 && container.scrollTop > 0) {
          container.scrollTop -= 14;
        } else if (e.clientY > cRect.bottom - 45 && container.scrollTop < container.scrollHeight - container.clientHeight) {
          container.scrollTop += 14;
        }
      }

      const boxLeft = Math.min(startX, e.clientX);
      const boxTop = Math.min(startY, e.clientY);
      const boxWidth = Math.abs(e.clientX - startX);
      const boxHeight = Math.abs(e.clientY - startY);

      setDragBox({ left: boxLeft, top: boxTop, width: boxWidth, height: boxHeight });

      // Hit-test against all profile elements
      const elements = document.querySelectorAll('[data-profile-id]');
      const draggedIds = [];
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const intersects = !(
          rect.right < boxLeft ||
          rect.left > (boxLeft + boxWidth) ||
          rect.bottom < boxTop ||
          rect.top > (boxTop + boxHeight)
        );
        if (intersects) {
          const pid = el.getAttribute('data-profile-id');
          if (pid) draggedIds.push(pid);
        }
      });

      const nextSelection = Array.from(new Set([...initialSelected, ...draggedIds]));
      setSelectedProfiles(nextSelection);
    };

    const handleMouseUp = () => {
      if (dragInfoRef.current.isDown) {
        const { isDragging, wasBlankClick, initialSelected } = dragInfoRef.current;
        dragInfoRef.current.isDown = false;
        dragInfoRef.current.isDragging = false;
        setDragBox(null);

        // If it was just a click on empty canvas area without dragging and without modifiers, clear selection
        if (!isDragging && wasBlankClick && initialSelected.length === 0) {
          setSelectedProfiles([]);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [contentContainerRef, setSelectedProfiles]);

  const handleContainerMouseDown = (e) => {
    if (e.button !== 0) return; // Only primary mouse button
    // Ignore clicks on buttons, inputs, links, dropdown menus or no-drag regions
    if (e.target.closest('button, input, select, textarea, a, [role="button"], [data-no-drag="true"]')) {
      return;
    }

    const isModifier = e.ctrlKey || e.metaKey || e.shiftKey;
    const isProfileItem = !!e.target.closest('[data-profile-id]');

    dragInfoRef.current = {
      isDown: true,
      isDragging: false,
      startX: e.clientX,
      startY: e.clientY,
      initialSelected: isModifier ? selectedProfilesRef.current : [],
      wasBlankClick: !isProfileItem
    };
  };

  return {
    dragBox,
    handleContainerMouseDown
  };
}
