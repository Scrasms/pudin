import { useTag } from '../../hooks/useTag';
import TagList from '../TagList';

// Displays first 5 tags (chronologically) of the book in a scrollable horizontal container
const ShelfTags = ({ tags }: { tags: Array<string> }) => {
  const truncTags = tags.slice(0, 5);
  const [appendTag] = useTag();

  return (
    <>
      <TagList
        tags={truncTags}
        onClick={appendTag}
        sx={{
          height: '50px',
          alignItems: 'center',
          overflowY: 'hidden',
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent',
        }}
      />
    </>
  );
};

export default ShelfTags;
