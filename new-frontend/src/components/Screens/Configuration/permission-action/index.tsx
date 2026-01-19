'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  useDeleteRole,
  useGetPermissionsActions,
  usePermissionsRegister,
  useUpdaterole,
} from './hooks'

import PermissionActionForm from './form'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import CustomModal from '@/components/common/Modal/DialogModal'
import DataTable from '@/components/common/DataTable'
import Breadcrumb from '@/components/common/breadcrumb'

const PermissionActionRoute = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
  const [roleId, setRoleId] = useState<any | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data: allData = [], isLoading, refetch, isFetching } = useGetPermissionsActions()

  const totalItems = allData.length
  const totalPages = Math.ceil(totalItems / rowsPerPage)

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return allData.slice(start, start + rowsPerPage)
  }, [allData, currentPage, rowsPerPage])

  const addRegisterMutation = usePermissionsRegister()
  const updateRoleMutation = useUpdaterole(roleId)
  const deleteRoleMutation = useDeleteRole(roleId)

 const columns = [
  {
    field: "srNo",
    headerName: "Sr.No",
    cellRenderer: (params: any) =>
      (currentPage - 1) * rowsPerPage + params.node.rowIndex + 1,
      filter:false,
  },
  {
    field: "permissions.permissionsName",
    headerName: "Permission Name",
    valueGetter: (params: any) => params.data.permissions?.permissionsName,
  },
  {
    field: "actionName",
    headerName: "Action Name",
  },
  {
    field: "permissions.category",
    headerName: "Category",
    valueGetter: (params: any) => params.data.permissions?.category,
  },
  {
    field: "available",
    headerName: "Available",
    cellRenderer: (params: any) => (params.value ? "Yes" : "No"),
      filter:false,
  },
]

  const handleOpenChange = () => {
    setRoleId(null)
    setIsModalOpen(true)
  }

  const handleCloseAction = () => {
    setIsModalOpen(false)
  }

  const handleSubmit = (formData: any) => {
    if (roleId) {
      updateRoleMutation.mutate(formData, {
        onSuccess: () => refetch(),
      })
    } else {
      addRegisterMutation.mutate(formData, {
        onSuccess: () => refetch(),
      })
    }
    setIsModalOpen(false)
  }

  const confirmDelete = () => {
    if (roleId) {
      deleteRoleMutation.mutate(roleId, {
        onSuccess: () => refetch(),
      })
    }
    setIsDeleteConfirmationOpen(false)
  }

  const cancelDelete = () => {
    setIsDeleteConfirmationOpen(false)
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


  
 const addComponent = (
  <div className='flex gap-2'>
          <Button onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
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
                label: "Permission Action",
              },
            ]}
          />
        </div>

        
 <div className="flex items-center justify-center mb-6">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className='text-3xl font-bold tracking-tight text-primary'>Permission Actions</h1>
              <p className='text-muted-foreground'>Total: {totalItems}</p>
        </div>
      </div>
    
            <DataTable
              rowData={paginatedData}
              colDefs={columns}
              isLoading={isLoading}
              addLabel='Add Permission'
              addComponent={addComponent}
              onAddClick={handleOpenChange}
              showEdit={false}
              showDelete={false}
              showExportButton={false}
              showHideColumns={true}
              showActions={false}
              pagination={false}
              showPagination={true}
              page={currentPage}
              totalPages={totalPages}
              setPage={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              showFilter={false}
            />

      {/* Add/Edit Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseAction}
        dialogTitle={roleId ? 'Edit Permission Action' : 'Add Permission Action'}
        dialogDescription={
          roleId
            ? 'Edit your Permission Action details here...'
            : 'Add Permission Action here...'
        }
        formId='permissionAction-form'
        width='max-w-4xl'
        height='h-auto'
      >
        <PermissionActionForm
          onSubmit={handleSubmit}
          formId='permissionAction-form'
        />
      </CustomModal>

      {/* Confirmation Modal */}
      <CustomModal
        isOpen={isDeleteConfirmationOpen}
        onClose={cancelDelete}
        dialogTitle='Confirm Deletion'
        dialogDescription='Are you sure you want to delete this role?'
        formId='delete-confirmation-form'
        width='30%'
        height='30%'
        showCloseButton={false}
        showSaveButton={false}
      >
        <div className='flex justify-around mt-4'>
          <Button variant='destructive' onClick={confirmDelete}>
            Confirm
          </Button>
          <Button variant='outline' onClick={cancelDelete}>
            Cancel
          </Button>
        </div>
      </CustomModal>
    </div>
  )
}

export default PermissionActionRoute
