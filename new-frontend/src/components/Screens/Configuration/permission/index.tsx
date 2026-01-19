

import { useState, useCallback, useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PermissionForm from './form'
import { useGetPermissions, usePermissionsRegister } from './hooks'
import CustomModal from '@/components/common/Modal/DialogModal'
import DataTable from '@/components/common/DataTable'
import Breadcrumb from '@/components/common/breadcrumb'

const PermissionRoute = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data: allPermissions = [], isLoading, refetch, isFetching } = useGetPermissions()
  const addRegisterMutation = usePermissionsRegister()

  const totalItems = allPermissions.length
  const totalPages = Math.ceil(totalItems / rowsPerPage)

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    const end = start + rowsPerPage
    return allPermissions.slice(start, end)
  }, [allPermissions, currentPage, rowsPerPage])

  console.log("paginatedData",paginatedData);
  
  const handleOpenChange = () => {
    setIsModalOpen(true)
  }

  const handleCloseAction = () => {
    setIsModalOpen(false)
  }

  const handleSubmit = (formData: any) => {
    addRegisterMutation.mutate(formData, {
      onSuccess: () => {
        refetch()
        console.log('Refetched after add')
      },
    })
    setIsModalOpen(false)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = useCallback(
    (size: number) => {
      const newTotalPages = Math.ceil(totalItems / size)
      setRowsPerPage(size)
      if (currentPage > newTotalPages) {
        setCurrentPage(1)
      }
    },
    [totalItems, currentPage]
  )

  const columnDefs = [
    {
      field: "srNo",
      headerName: "Sr.No",
      cellRenderer: (params: any) =>
        (currentPage - 1) * rowsPerPage + params.node.rowIndex + 1,
        filter:false,
    },  
    { field: "module",
       headerName: "Module Name",
        cellRenderer: (params: any) =>params.data.module.moduleName,
      },

    
    { field: "category", headerName: "Catagory" },
    { field: "permissionsName", headerName: "Permission Name" },
  ]

 const addComponent = (
  <div className="flex items-center gap-2">
    <Button onClick={() => refetch()} disabled={isFetching}>
      {isFetching ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Refreshing...
        </>
      ) : (
        'Refresh'
      )}
    </Button>
  </div>
)

  return (
    <div className='container mx-auto py-6'>



         <div className="mb-6">
                <Breadcrumb
                  items={[
                    {
                      label: "Module Dashboard",
                      path: "/dashboard",
                    },
                    {
                      label: "Permission",
                    },
                  ]}
                />
              </div>


 <div className="flex items-center justify-center mb-6">
        <div className="flex flex-col items-center justify-center text-center">
             <h1 className='text-3xl font-bold tracking-tight text-primary'>Permissions</h1>
            <p className='text-muted-foreground'>
            Total Permissions: {totalItems}
          </p>
        </div>
      </div>

   
            <DataTable
              rowData={paginatedData}
              colDefs={columnDefs}
              isLoading={isLoading}
              addComponent={addComponent}
              addLabel='Add Permission'
              onAddClick={handleOpenChange}
              showEdit={false}
              showDelete={false}
              showExportButton={false}
              showHideColumns={true}
              showActions={false}
              pagination={false}
              showPagination={true}
                  showFilter={false}
              page={currentPage}
              totalPages={totalPages}
              setPage={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
       

      <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseAction}
        dialogTitle='Add Permission'
        dialogDescription='Add your permission details below.'
        formId='permission-form'
       width='max-w-5xl'
        height='h-auto'
      >
        <PermissionForm onSubmit={handleSubmit} formId='permission-form' />
      </CustomModal>
    </div>
  )
}

export default PermissionRoute
