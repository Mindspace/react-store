/* eslint-disable */
import { useState, useEffect, useCallback } from 'react';
import { DataPaginator, Paginator } from '@mindspace-io/core';

export const useStorePaginator = <T extends any>(
  rawList: Array<T>,
  pageSize = 10
) => {
  const [paginator] = useState(() => new DataPaginator(rawList, pageSize));
  const setPageSize = useCallback(
    (numRows: number) => {
      paginator.pageSize = numRows;
      announceChanges();
    },
    [paginator]
  );
  const goToPage = useCallback(
    (page: number) => {
      const results = paginator.goToPage(page);
      announceChanges();
      return results;
    },
    [paginator]
  );
  const announceChanges = useCallback(() => {
    const { totalCount, totalPages, currentPage, paginatedList, pageSize } =
      paginator;
    setPaginationVM({
      totalCount,
      totalPages,
      currentPage,
      paginatedList,
      pageSize,
      goToPage,
      setPageSize,
    });
  }, [paginator, goToPage, setPageSize]);

  const [vm, setPaginationVM] = useState<Paginator>(paginator);

  useEffect(() => {
    paginator.rawList = rawList;
    announceChanges();
    return () => {
      paginator.rawList = [];
    };
  }, [paginator, rawList, announceChanges]);

  return vm;
};
