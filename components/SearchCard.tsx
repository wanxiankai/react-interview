import React, { useEffect, useState } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { RepositoryOption } from './RepositoryOption'
import { FaceSmileIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import useDebounce from '../hooks/useDebounce'
import { useRouter } from 'next/router'
import { Repository } from '../types/repoInfo'

function formatSearchString(q: string) {
    return q.toLowerCase().replace(/^[#>]/, '')
}

function trimSpace(str:string){ 
    return str.replace(/(^\s*)|(\s*$)/g, ""); 
}

export default function SearchCard() {
    const [open, setOpen] = React.useState(true)
    const router = useRouter()

    React.useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setOpen(true)
            }, 500)
        }
    }, [open])

    const [rawQuery, setRawQuery] = React.useState('')
    const [list, setList] = useState<Repository[]>([])
    const debouncedSearch = useDebounce(rawQuery, 500)

    useEffect(() => {
        const trimQery = trimSpace(debouncedSearch)
        if (trimQery) {
            const q = formatSearchString(trimQery)
            getRepos(q)
        }
    }, [debouncedSearch])

    async function getRepos(name: string) {
        const response = await fetch(`/api/search?q=${name}`, {
            method: "GET"
        })
        if (!response.ok) {
            console.log("搜索结果出错:", response.statusText)
            return;
        }
        const { items } = await response.json()
        setList(items)
    }

    return (
        <Transition.Root
            show={open}
            as={React.Fragment}
            afterLeave={() => {
                // 如果要清除就将搜索结果和文字都清除，这样感觉正常一点
                setList([])
                setRawQuery('')
            }}
            appear
        >
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-2xl shadow-slate-300/10 bg-slate-900/70 shadow-2xl ring-1 ring-sky-500 ring-opacity-5 backdrop-blur-xl backdrop-filter transition-all">
                            <Combobox
                                value=""
                                onChange={(item: string) => {
                                    router.push(item)
                                }}
                            >
                                <div className="relative">
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-500"
                                        aria-hidden="true"
                                    />
                                    <Combobox.Input
                                        className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-100 placeholder-gray-500 focus:ring-0 sm:text-sm focus:outline-0"
                                        placeholder="Search GitHub repos..."
                                        onChange={(event) => setRawQuery(event.target.value)}
                                    />
                                </div>

                                <Combobox.Options
                                    static
                                    className="max-h-80 scroll-py-10 scroll-pb-2 space-y-4 overflow-y-auto p-4 pb-2"
                                >
                                    <li>
                                        <h2 className="text-xs font-semibold text-gray-200">
                                            Repositories
                                        </h2>
                                        <ul className="-mx-4 mt-2 text-sm text-gray-700 space-y-0.5">
                                            {list.length > 0 && list.map((item) => <RepositoryOption key={item.id} item={item} />)}
                                        </ul>
                                    </li>
                                </Combobox.Options>
                                <span className="flex flex-wrap items-center bg-slate-900/20 py-2.5 px-4 text-xs text-gray-400">
                                    <FaceSmileIcon className="w-4 h-4 mr-1" />
                                    Welcome to Zolplay&apos;s React Interview Challenge.
                                </span>
                            </Combobox>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
