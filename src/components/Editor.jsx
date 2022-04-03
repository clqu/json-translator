import { Transition } from '@headlessui/react';
import dynamic from 'next/dynamic';
import { useState, Fragment } from "react";

const EditorComponent = dynamic(
    () => import('@monaco-editor/react'),
    { ssr: false }
);

export default function Editor({ defaultValue, setValue }) {
    const [ isValid, setIsValid ] = useState(true);

    function handleChange(value) {
        try {
            JSON.parse(value);
            setValue(value);
            setIsValid(true);
        } catch {
            setIsValid(false);
        };
    };

    return (
        <>            
            <EditorComponent
                language="json"
                value={defaultValue}
                theme="vs-dark"
                saveViewState={false}
                options={{
                    minimap: {
                        enabled: false
                    },
                    tabSize: 4
                }}
                maxLength={5000}
                onChange={handleChange}
            />
            <Transition
                as={Fragment}
                show={!isValid}
                enter="transform transition duration-[400ms]"
                enterFrom="opacity-0 scale-50"
                enterTo="opacity-100 scale-100"
                leave="transform duration-200 transition ease-in-out"
                leaveFrom="opacity-100 rotate-0 scale-100 "
                leaveTo="opacity-0 scale-75"
            >
                <div className="invalid-syntax animate-pulse font-bold italic text-zinc-200 absolute bottom-0 right-0 pt-5 pl-5 pb-1 pr-2">
                    Invalid Syntax
                </div>
            </Transition>
        </>
    );
};