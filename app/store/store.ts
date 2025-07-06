import { create } from 'zustand'
import { TLaunchTable } from '~/lib/types'

type TStore  = {
    launchesData : TLaunchTable[] | null
    setLaunchesData: (data: TLaunchTable[]) => void
    tableData : TLaunchTable [] 
    setTableData : (data:TLaunchTable[]) => void
}

export const useLaunches = create<TStore>((set) => ({
    launchesData: null,
    setLaunchesData: (data:TLaunchTable[]) => set(() => ({ launchesData: data })) ,
    setTableData: (data) => set( () => ({tableData:data})),
    tableData : []
}))
