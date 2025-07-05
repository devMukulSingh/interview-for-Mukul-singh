'use client'

import { useSearchParams } from "@remix-run/react"

export default function useUrlSearchParams() {
    const [searchParams, setSearchParams] = useSearchParams();
    const params = new URLSearchParams();
    function setParams(key: string, value: string) {
        params.set(key, value)
        setSearchParams(prev => {
            prev.set(key, value);
            return prev;
        }, { preventScrollReset: true })
    }
    function getParams(key: string) {
        return searchParams.get(key);
    }
    function removeParams(key:string){
        params.delete(key);
        setSearchParams(params,{preventScrollReset:true})
    }
    return { setParams, getParams, removeParams }
}