import React from 'react';
import { useParams } from 'react-router-dom';

export const WorldDetail = () => {
  const { worldId } = useParams();
  return (
    <article>
      <h3>{worldId}</h3>
    </article>
  );
};
