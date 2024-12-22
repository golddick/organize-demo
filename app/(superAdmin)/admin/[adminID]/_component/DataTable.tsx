



'use client';

import * as React from 'react';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface MappedWorkspace {
  id: string;
  $createdAt: string;
  $id: string;
  name: string;
  view: string;
}

interface DataTableProps {
  columns: GridColDef[];
  rows: MappedWorkspace[];
}

const DataTable: React.FC<DataTableProps> = ({ columns, rows }) => {
  // Add the renderCell function here since it needs to be client-side
  const updatedColumns = columns.map((column) => {
    // if (column.field === 'ImageUrl') {
    //   return {
    //     ...column,
    //     renderCell: (params: any) => (
    //       <Image
    //         src={params.value ? params.value : '/img/noImg.jpg'}  // Fallback image if no ImageUrl
    //         alt="Logo"
    //         style={{ width: '50px', padding:'4px', height: '50px', borderRadius: '100%', objectFit:'cover', backgroundColor:'#e09f05'  }}
    //       />
    //     ),
    //   };
    // }

    if (column.field === 'view') {
        return {
            ...column,
            renderCell: (params: GridCellParams) => (
                <Link href={params.value ? params.value : '/'}>
                <Button   type='button' className=' z-50'>
                    view
                </Button>
                </Link>
            )
        }
    }



    return column;
  });

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={updatedColumns}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default DataTable;



