import { useCallback, useContext } from 'react';
import { ErrorContext } from '../contexts/ErrorContext';
import { useSearchParams } from 'react-router';

// TODO: fix bug where prev isn't added because of dupe BUT nav history IS updated
// Adds or removes the given filter tag from search params
export const useTag = () => {
  const [, setSearchParams] = useSearchParams();
  const { showError } = useContext(ErrorContext);

  const appendTag = useCallback(
    (tag: string) => {
      setSearchParams((prev) => {
        const trimTag = tag.trim();

        // Add to search params if not already there or less than 5 have been added
        const prevTags = prev.getAll('tag');
        if (prevTags.length >= 5) {
          showError(new Error('User can only filter by 5 tags at once'));
          return prev;
        }

        if (!prevTags.includes(trimTag)) {
          prev.append('tag', trimTag);
        }
        return prev;
      });
    },
    [showError, setSearchParams],
  );

  const removeTag = useCallback(
    (tag: string) => {
      setSearchParams((prev) => {
        const trimTag = tag.trim();

        const prevTags = prev.getAll('tag');
        const newTags = prevTags.filter((tag) => tag !== trimTag);

        prev.delete('tag');

        newTags.forEach((tag) => prev.append('tag', tag));
        return prev;
      });
    },
    [showError, setSearchParams],
  );
  return [appendTag, removeTag];
};
