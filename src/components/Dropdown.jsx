import { Switch, Transition } from "@headlessui/react";
import { Fragment, useRef, useState, useEffect } from "react";

const Dropdown = ({ className, changeFunction, currentValue, title, items }) => {
    let [dropdown, setDropdown] = useState(false);
    let [searchFilter, setSearchFilter] = useState(false);
    let dropdownRef = useRef(null);
  useEffect(() => {
    const pageClickEvent = (e) => {
        if (dropdownRef.current !== null && !dropdownRef.current.contains(e.target)) {
            setDropdown(!dropdown);
        }
    };
    if (dropdown) {
      window.addEventListener('click', pageClickEvent);
    }
    return () => {
      window.removeEventListener('click', pageClickEvent);
    }
  }, [dropdown]);

  useEffect(() => { setSearchFilter(searchFilter) }, [searchFilter]);
  return (
    <>
        <div ref={dropdownRef} className={`relative w-full ${className}`}>
            <div onClick={() => setDropdown(!dropdown)} className="cursor-pointer flex justify-between items-center bg-dark w-full px-4 py-2 rounded-lg">
                {title}
                <i className={`fal fa-chevron-down transition-all duration-200 ${dropdown && 'rotate-180'}`}/>
            </div>
            <Transition
                as={Fragment}
                show={dropdown}
                enter="transition-all duration-300"
                enterFrom="opacity-0 translate-y-6"
                enterTo="opacity-100 translate-y-0"
                leave="transition-all duration-300"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-6"
            >
                
                <div style={{ zIndex: 200 }} className="max-h-[20rem] overflow-auto mt-2 bg-black absolute w-full rounded-lg py-2">
                    <input onChange={e => setSearchFilter(e.target.value)} className="w-[calc(100%-1rem)] px-3 py-1.5 outline-none text-sm mx-auto mb-4 block rounded-lg bg-dark" placeholder="Search" type="text" spellCheck={false} autoComplete={false} />
                    {items.filter(a => {
                        if(searchFilter) {
                            if(a.label.toLowerCase().includes(searchFilter.toLowerCase())) return true;
                            return false;
                        } else {
                            return true;
                        }
                    }).map((item, index) => (
                        <div onClick={() => changeFunction(item.value)} key={index} className="items-center flex justify-between cursor-pointer hover:bg-zinc-500/10 dark:hover:bg-darkBg w-full px-4 py-1">
                            {item.label}
                            {item.value === currentValue && (
                                <i className="fal fa-check" />
                            )}
                        </div>
                    ))}
                </div>
            </Transition>
        </div>
    </>
  );
};

export default Dropdown;
