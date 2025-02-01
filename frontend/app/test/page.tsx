'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

function WritingTest() {
  const router = useRouter();
  const { inputValue } = router.query;  // Retrieve the query parameter

  // Log the query parameter to verify it's passed correctly
  useEffect(() => {
    if (inputValue) {
      // console.log('Received inputValue:', inputValue);  // This will print to the console
    }
  }, [inputValue]);

  return (
    <div>
      <h1>Writing Test Page</h1>
      <p>Received Input: {inputValue}</p>
    </div>
  );
}

export default WritingTest;
