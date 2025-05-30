import React from 'react';
import { useParams } from 'react-router-dom';

const SocialPage = () => {
  const { specId } = useParams();

  return (
    <>
      <h1>소셜 페이지</h1>
      <p>specId: {specId}</p>
    </>
  );
};

export default SocialPage;
