import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
// import { useState, useEffect } from 'react';

export default function BasicPagination({ page, cuntPage, setPage, refHome }) {

  const handleChange = (event, value) => {

    setPage(Number(value));
    if (refHome.current) {
      refHome.current.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <>

      {cuntPage != 1 ? (<Stack style={{ margin: 'auto' }} spacing={2}>
        <Pagination
          count={cuntPage}
          page={Number(page)}
          onChange={handleChange}
          color="secondary"
        />
      </Stack>) : ''}
      {/* <Stack style={{ margin: 'auto' }} spacing={2}>
        <Pagination
          count={cuntPage}
          page={Number(page)}
          onChange={handleChange}
          color="secondary"
        />
      </Stack> */}
    </>);
}