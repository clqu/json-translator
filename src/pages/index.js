import { Transition } from '@headlessui/react';
import Head from 'next/head'
import { Fragment, useState, useEffect } from 'react';
import Dropdown from '../components/Dropdown'
import Editor from '../components/Editor'
import Languages from '../public/libs/languages.json';
import axios from 'axios';
import { saveAs } from 'file-saver';

export default function Home() {
  let [value, setValue] = useState(`{

}`)

  let [file, setFile] = useState();
  let [loading, setLoading] = useState(false);
  let [fileLanguage, setFileLanguage] = useState();
  let [translateTo, setTranslateTo] = useState([]);
  let [translated, setTranslated] = useState(false);
  let [error, setError] = useState();
  let [copy, setCopy] = useState();
  let [copied, setCopied] = useState(false);
  let [loader, setLoader] = useState();

  const handleFileChange = (e) => {
    let file = e?.target?.files[0];
    if (file) {
      if (file.type === "application/json") {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (f) {
          setFile(file);
          setValue(f?.target?.result)
        }

      }
    }
  };

  const handleFileLanguage = e => {
    let _ = Languages.find(a => a.code === e);
    if(_) {
      setFileLanguage(_)
    }
  }
  const handleTranslateTo = e => {
    let _ = Languages.find(a => a.code === e);
    if(_) {
      if(!translateTo.find(a => a.code === e)) {
        setTranslateTo([...translateTo, _])
      }
    }
  }
  
  



  const SubmitTranslation = () => {
    setLoading(true);
    setTranslated(false);
    setError();
    setCopy();
    setCopied(false);
    setTimeout(() => {
      try {
        if(!fileLanguage) return setError('Please select file language.');
        if(!translateTo || translateTo.length <= 0) return setError('Please select translate to language.');
        axios.post('https://translate.voiddevs.org/api/translate?from='+fileLanguage?.code+'&to='+translateTo?.map(a => a?.code)?.join(','), JSON.parse(value))
          .then(r => {
            if(r) {
              if(r?.data) {
                if(r?.data?.success) {
                  setLoader();
                  setTranslated(true);
                  setCopy(JSON.stringify(r?.data?.data));
                } else {
                  setError(r?.data?.errors[0]?.message || 'Something went wrong...');
                }
              }
            }
            
          });
      } catch {
        setError('Something went wrong...');
      };
    }, 1000)
  }
  const DownloadFile = () => {
    var JSZip = require("jszip");
    var zip = new JSZip();
    try {
      let _ = JSON.parse(copy);
      Object.keys(_).map(e => zip.file(`${e}.json`, JSON.stringify(_[e])));
      zip.generateAsync({type:"blob"}).then(function (content) {
        saveAs(content, "locales.zip");
      });
    } catch {};
  }
  const CopyClipboard = () => {
    navigator.clipboard.writeText(copy);
    setCopied(true);
  }
  useEffect(() => { setTranslateTo(translateTo) }, [translateTo]);
  useEffect(() => { setFileLanguage(fileLanguage) }, [fileLanguage]);
  useEffect(() => { setTranslated(translated) }, [translated]);
  useEffect(() => { setCopy(copy) }, [copy]);
  useEffect(() => { setLoader(loader) }, [loader]);
  return (
    <>
      <Head>
        <title>Translate your JSON files!</title>
        <meta name="description" content="Auto translation script for your JSON files. Developed by clqu.live & swoth.xyz" />
        <link href="https://pro.fontawesome.com/releases/v6.0.0-beta1/css/all.css" rel="stylesheet" />

      </Head>

      <Transition
          show={loading ? true : false}
          enter='transition-all duration-200'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='transition-all duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
      > 
        <div style={{ zIndex: 9999 }} className="top-0 overflow-hidden inset-0 bg-black/75 w-full h-full fixed">
          <div className="flex items-center justify-center w-full h-full text-xl">
          {!error ? translated ? (
              <>
                <div className="flex flex-col items-center w-full gap-x-4 py-4 text-white justify-center">
                  
                    <p className="shadow-xl">The file you added has been translated into {translateTo.length} languages.</p>
                    <div className="flex w-full gap-x-4 py-4 text-white justify-center">
                      <div onClick={() => DownloadFile()}  className="hover:shadow-2xl hover:opacity-90 bg-gradient-to-l from-purple-800 to-violet-800 font-medium cursor-pointer px-6 py-2 rounded-lg transition-all duration-200">
                        <p className="flex items-center">
                          <i className="fal fa-download animate-pulse mr-5 text-3xl" />Download 
                          <span className="text-gray-400 text-sm ml-2">locales.zip</span>
                        </p>
                      </div>
                      <div onClick={() => CopyClipboard()} className="hover:shadow-2xl hover:opacity-90 bg-gradient-to-l from-blue-800 to-blue-600 font-medium cursor-pointer px-6 py-2 rounded-lg transition-all duration-200">
                        <p className="flex items-center">
                          <i className="fal fa-copy animate-pulse mr-5 text-3xl" />{copied ? 'Copied to Clipboard' : 'Copy Clipboard'}
                        </p>
                      </div>
                    </div>
                </div>
              </>
            ) : (
              <>
                <i className="fal fa-spinner-third fa-spin mr-5 text-3xl" />
                <div>
                  <p className="font-medium">Translating... </p>
                  {translateTo.length > 1 && (<p className="font-normal text-sm text-gray-200">If you have selected more than one language, the process may take a long time.</p>)}
                </div>
              </>
            ) : (
              <>
                <i className="fal fa-times mr-5 text-3xl" />
                <p className="font-medium">{error || "Something went wrong..."}</p>
              </>
            )}

            <div onClick={() => {
              setLoading(false);
            }} className="hover:bg-zinc-500/20 w-12 h-12 flex justify-center items-center rounded-lg transition-all duration-200 cursor-pointer absolute top-5 right-5">
              <i className="fal fa-times" />
            </div>
          </div>
        </div>
      </Transition>
      <div className="overflow-hidden h-screen flex w-full justify-center">
        <div className="w-full h-full max-w-7xl p-12">
          <p className="text-3xl mb-8 font-semibold">Translate your Language Files</p>

          <div className="grid grid-cols-12 h-full gap-6">
            <div className="col-span-6 w-full">
              <div className="flex mt-2 w-full items-center justify-between">
                <p>
                  <i className="fa fa-language mr-2 text-gray-400 text-lg" />File Language
                </p>
                <Dropdown className="max-w-[12rem]" changeFunction={handleFileLanguage} currentValue={fileLanguage?.code || 'no_iso'} title={fileLanguage?.name || 'Select language'} items={Languages.map(a => {
                  return {
                    label: a.name,
                    value: a.code
                  }
                })} />
              </div>
              <div className="flex mt-2 w-full items-center justify-between">
                <p>
                  <i className="fa fa-upload mr-2 text-gray-400 text-lg" />Upload File
                </p>
                <div className="cursor-pointer relative h-full max-w-[12rem] bg-dark w-full rounded-lg">
                  <div className="cursor-pointer flex justify-between w-full h-full items-center px-4 py-2">
                    {file ? <><i className="fa fa-file text-gray-400 text-lg" />{file?.name}</> : <><i className="fa fa-upload text-gray-400 text-lg" />Upload File</>}
                  </div>
                  <input style={{ zIndex: 2 }} onChange={handleFileChange} accept=".json" type="file" className="cursor-pointer top-0 opacity-0 left-0 absolute w-full h-full" />
                </div>

              </div>
              <div>
              <div className="flex mt-2 w-full items-center justify-between">
                <p>
                  <i className="fa fa-language mr-2 text-gray-400 text-lg" />Translate To
                </p>
                <Dropdown className="max-w-[12rem]" changeFunction={handleTranslateTo} currentValue={'no_iso'} title={translateTo?.name || 'Select language'} items={Languages.map(a => {
                  return {
                    label: a.name,
                    value: a.code
                  }
                })} />
              </div>
              <div className="flex flex-wrap gap-4 mt-1">
              <Transition
                  show={translateTo.length > 0 ? true : false}
                  className="grid grid-cols-3 gap-4 mt-3"
              >
              
                {(translateTo || []).map((t, i) => (
                <Transition.Child 
                  as={Fragment}
                  enter="transform transition duration-[400ms]"
                  enterFrom="opacity-0 scale-50"
                  enterTo="opacity-100 scale-100"
                  leave="transform duration-200 transition ease-in-out"
                  leaveFrom="opacity-100 rotate-0 scale-100 "
                  leaveTo="opacity-0 scale-75"
                >
                  <div key={i} className="flex items-center justify-between gap-x-4 bg-dark px-2 py-2 rounded-md">
                    <span className="uppercase text-gray-400 text-xs">{t.code}</span>
                    <p className="break-words line-clamp-1 text-sm">{t.name}</p>
                    <span 
                      onClick={() => {
                        setTranslateTo(translateTo.slice(0,i).concat(translateTo.slice(i + 1)))
                      }}
                      className="cursor-pointer transition-all duration-200 w-6 h-6 flex items-center justify-center hover:bg-red-500 rounded-md"
                    ><i className="fal fa-times" /></span>
                  </div>
                  </Transition.Child>
                ))}
                </Transition>
              </div>
              </div>
            </div>
          
            <div className="h-screen col-span-6 w-full">
              <div className="flex justify-end h-3/5 w-full rounded-lg overflow-hidden relative w-full">
                <Editor defaultValue={value} setValue={setValue} />
              </div>
              <div className="flex w-full py-4 text-white justify-end">
                  <div onClick={() => SubmitTranslation()} className="hover:shadow-2xl bg-gradient-to-l from-purple-800 to-violet-800 font-medium cursor-pointer px-6 py-2 rounded-lg transition-all duration-200">
                    <p>Translate</p>
                  </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  )
}
