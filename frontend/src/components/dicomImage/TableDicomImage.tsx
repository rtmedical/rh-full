import {useMemo} from "react";
import {MRT_ColumnDef, MRT_Table, useMaterialReactTable} from "material-react-table";
import {DicomImage} from "../../models/DicomImage";
import {MenuItem} from "@mui/material";
import LoadingComponent from "../LoadingComponent";

export default function TableDicomImage({images, loading}: { images: DicomImage[]; loading: boolean; }) {
    const columns = useMemo<MRT_ColumnDef<DicomImage>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
            },
            {
                accessorKey: 'filename',
                header: 'File',
            },
            {
                accessorKey: 'createdAt',
                header: 'Criado em:',
                Cell: ({cell}) => <p>{cell.getValue<Date>().toLocaleString()}</p>,
            },
            {
                accessorKey: 'updatedAt',
                header: 'Alterado em:',
                Cell: ({cell}) => <p>{cell.getValue<Date>().toLocaleString()}</p>,
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: images,
        enableKeyboardShortcuts: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enablePagination: false,
        enableSorting: true,
        positionActionsColumn: "last",
        muiTableBodyRowProps: ({row}) => ({
            onClick: (event) => {
                window.location.href = `/dicom-image/${row.getValue("id")}`;
            },
            sx: {
                cursor: "pointer",
            },
        }),
    });

    if (loading) {
        return <LoadingComponent/>;
    }

    return <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <MRT_Table table={table}/>
    </div>;
}