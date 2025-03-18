import React, { useEffect, useState } from 'react';
import AdminPageLayout from '../../AdminComponents/AdminPageLayout';
import { Link } from 'react-router-dom';
import { Apis, AuthGetApi, AuthPostApi } from '../../services/API';
import ModalLayout from '../../utils/ModalLayout';
import FormInput from '../../utils/FormInput';
import FormButton from '../../utils/FormButton';
import { IoMdClose } from "react-icons/io";
import Loader from '../../GeneralComponents/Loader';
import { ErrorAlert, SuccessAlert } from '../../utils/pageUtils';


const AdminAddTools = () => {
  const [tools, setTools] = useState([]);
  const [modal, setModal] = useState(false);
  const [del, setDel] = useState(false)
  const [dataLoading, setDataLoading] = useState({ status: false, val: '' });
  const [features, setFeatures] = useState([""]);
  const [title, setTitle] = useState('')
  const [id, setId] = useState('')

  const FetchTools = async () => {
    setDataLoading({ staus: true, val: 'fetch' });
    try {
      const response = await AuthGetApi(Apis.admin.get_tools);
      if (response.status === 200) {
        setTools(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDataLoading({ status: false, val: '' });
    }
  };

  useEffect(() => {
    FetchTools();
  }, []);

  // Function to add a new feature field
  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  // Function to handle input change
  const handleInputChange = (index, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  // Function to remove a feature field
  const removeFeature = (index) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };

  const submitFeature = async (e) => {
    e.preventDefault()
    if (!title) return ErrorAlert(`Tool title is missing`)
    if (features.length === 0 || !features[0].trim()) return ErrorAlert(`Add at least One feature to this tool`)
    setModal(false)
    setDataLoading({ status: true, val: 'create' })
    const formdata = {
      name: title,
      features: features
    }
    try {
      const res = await AuthPostApi(Apis.admin.create_tool, formdata)
      if (res.status !== 201) return ErrorAlert(res.msg)
      await new Promise((resolve, reject) => setTimeout(resolve, 2000))
      setTitle('')
      setFeatures([''])
      FetchTools()
      SuccessAlert(res.msg)
    } catch (error) {
      console.log(`Error in submitting tool`, error)
    } finally {
      setDataLoading({ status: false, val: '' });
    }
  }

  const deleteTool = async () => {
    if (!id) return ErrorAlert('ID missing from request, try again!')
    setDel(false)
    setDataLoading({ status: true, val: 'delete' })
    try {
      const res = await AuthPostApi(`${Apis.admin.delete_tool}/${id}`)
      if (res.status !== 200) return ErrorAlert(res.msg)
      await new Promise((resolve, reject) => setTimeout(resolve, 2000))
      FetchTools()
      SuccessAlert(res.msg)
    } catch (error) {
      console.log(`Error in deleting tool`, error)
    } finally {
      setDataLoading({ status: false, val: '' })
    }
  }
  return (
    <AdminPageLayout>
      {del &&
        <ModalLayout setModal={setDel} clas={`lg:w-[50%] w-10/12 mx-auto`}>
          <div className="p-5  bg-white text-dark shadow-xl rounded-md">
            <div className="text-base text-center mb-3">Are you sure you want to make this tool?</div>

            <div className="flex items-center justify-between">
              <button onClick={() => setDel(false)} className='px-4 py-2 bg-red-500 text-white rounded-md'>Cancel</button>
              <button onClick={deleteTool} className='px-4 py-2 bg-green-500 text-white rounded-md'>Confirm</button>
            </div>

          </div>
        </ModalLayout>
      }
      {dataLoading.status &&
        <ModalLayout>
          <Loader title={dataLoading.val === 'fetch' ? 'loading tools' : dataLoading.val === 'create' ? 'creating tool' : 'deleting tool'} />
        </ModalLayout>
      }
      {modal && (
        <ModalLayout setModal={setModal} clas="w-11/12 mx-auto lg:w-1/2">
          <form onSubmit={submitFeature} className="w-full bg-white p-5 rounded-md text-primary">
            <div className="text-center capitalize font-bold">Add new Tool below</div>

            <div className="flex mt-5 items-start flex-col w-full">
              {/* Tool Name Field */}
              <div className="w-full">
                <FormInput label="Tool Name/Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              {/* Dynamic Feature Inputs */}
              <div className="w-full mt-3 grid grid-cols-1 md:grid-cols-2 gap-5">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center  w-full gap-2 mb-2">
                    <div className="w-full">
                      <FormInput
                        label={`Feature ${index + 1}`}
                        value={feature}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                      />
                    </div>
                    <IoMdClose className='text-2xl text-red-600 cursor-pointer'
                      onClick={() => removeFeature(index)}
                    />
                  </div>
                ))}
              </div>

              {/* Add New Feature Button */}
              <div
                onClick={addFeature}
                className="w-fit ml-auto mt-2 px-4 py-1.5 rounded-full bg-primary text-white cursor-pointer"
              >
                Add new feature
              </div>
            </div>
            <div className="w-full mt-10">
              <FormButton title={`Submit Tool`} />
            </div>
          </form>
        </ModalLayout>
      )}
      <div className="w-full">
        <div className="w-11/12 mx-auto">
          <Link to={`/admin/utilities`} className="px-4 py-1.5 rounded-md bg-ash">
            back to utilities
          </Link>

          <div className="flex mt-10 items-center justify-between w-full gap-5 flex-col lg:flex-row">
            <div className="capitalize">below are current product tools on monieQuest</div>
            <button onClick={() => setModal(true)} className="px-4 py-2 rounded-md text-primary bg-white">
              create new
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {Array.isArray(tools) && tools.length > 0 ? (
              tools.map((tool, i) => (
                <div key={i} className='w-full border border-gray-500 rounded-md p-2 relative'>
                  <div className="flex cursor-pointer items-center gap-2 mb-1">
                    <div className="capitalize">{tool.name}</div>
                  </div>
                  {Array.isArray(JSON.parse(tool.features)) ? (
                    JSON.parse(tool.features).map((item, k) => (
                      <div key={k} className='ml-5 text-zinc-400'>{item}</div>
                    ))
                  ) : (
                    <div className="text-sm italic text-gray-500">No features available</div>
                  )}
                  <div
                    onClick={() => { setId(tool.id); setDel(true) }}
                    className="absolute -top-4 cursor-pointer -right-4 p-1 rounded-full bg-red-500">
                    <IoMdClose className='text-xl text-white' />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mt-20 text-sm ">No tools found!</div>
            )}
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default AdminAddTools;