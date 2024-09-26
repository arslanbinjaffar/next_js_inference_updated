"use client";

import { IModel } from "@/app/models/Model";
import { TableActions, TableGeneric } from "@/app/components/admin/Table";
import { DialogCustom } from "@/app/components/common/Dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const TableHeaders = [
  {
    title: "ID",
    className: "",
  },
  {
    title: "Name",
  },
  {
    title: "Inference Time",
  },
  {
    title: "Version",
  },
  {
    title: "Network Name",
  },
  {
    title: "Path",
  },
  {
    title: "Description",
  },
  {
    title: "Accepts file",
  },
  {
    title: "Actions",
  },
];

const Model_Update_Dialogue_Initial_State: IModel = {
  _id: "",
  name: "",
  expectedInferenceTime: "",
  version: "",
  networkName: "",
  path: "",
  description: "",
  acceptFile: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  // Add other properties from IModel as needed
};

const Page = () => {
  const [models, setModels] = useState<IModel[]>([]);
  const [showUpdateModelModal, setShowUpdateModelModal] = useState(false);
  const [showCreateModelModal, setShowCreateModelModal] = useState(false);
  const [modelBeingUpdated, setModelBeingUpdate] = useState<IModel>(
    Model_Update_Dialogue_Initial_State
  );
  const [newModel, setNewModel] = useState(Model_Update_Dialogue_Initial_State);

  const fetchModelsData = async () => {
    try {
      const { data } = await axios.get("/api/model");
      setModels(data);
    } catch (error) {
      console.log(error, "Error at fetchModelsData");
    }
  };

  const updateModelsData = async () => {
    try {
      console.log(modelBeingUpdated, "in api method");
      await axios.put("/api/model", modelBeingUpdated);
      setModels((prev) =>
        prev.map((model) =>
          model._id === modelBeingUpdated._id ? { ...modelBeingUpdated } : model
        )
      );
      setShowUpdateModelModal(false);
    } catch (error) {
      console.log(error, "Error at updateModelsData");
    }
  };

  const createModel = async () => {
    try {
      const { data } = await axios.post("/api/model", newModel);

      const createdData = {
        _id: data._id,
        name: data.name,
        version: data.version,
        networkName: data.networkName,
        expectedInferenceTime:data.expectedInferenceTime,
        path: data.path,
        description: data.description,
        acceptFile: data.acceptFile,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as IModel;

      setModels((prev) => [...prev, createdData]);
      setShowCreateModelModal(false);
      setNewModel(Model_Update_Dialogue_Initial_State);
    } catch (error) {
      console.log(error, "Error at createModel");
    }
  };

  const deleteModel = async (id: string) => {
    try {
      await axios.delete("/api/model", { data: { id } });
      setModels((prev) => prev.filter((model) => model._id !== id));
    } catch (error) {
      console.log(error, "Error at deleteModel");
    }
  };

  useEffect(() => {
    fetchModelsData();
  }, []);

  // console.log(modelBeingUpdated)

  const updateActions = [
    {
      title: "Update",
      onClick: (model: any) => {
        // console.log(model)
        setShowUpdateModelModal(true);
        setModelBeingUpdate({ ...model });
      },
    },
    {
      title: "Delete",
      onClick: (model: IModel) => {
        // console.log(model)
        deleteModel(model._id as unknown as string);
      },
    },
  ];

  return (
    <>
      <div className="p-5">
        <div className="flex flex-row flex-wrap justify-between m-3">
          <h1 className="font-semibold text-2xl">Models</h1>
          <button
            onClick={() => setShowCreateModelModal(true)}
            className="mb-4 p-2 bg-blue-500 text-white rounded"
          >
            Create New Model
          </button>
        </div>
        <TableGeneric
          caption="Models List"
          headers={TableHeaders}
          rows={models.map((r) => ({
            _id: r._id,
            name: r.name,
            expectedInferenceTime: r.expectedInferenceTime || 20 + "s",
            version: r.version,
            networkName: r.networkName,
            path: r.path,
            description: r.description,
            acceptFile: r.acceptFile,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
            actions: (data: IModel) => (
              <TableActions actions={updateActions} data={data} />
            ),
          }))}
        />
      </div>

      <DialogCustom
        title="Create New Model"
        description="Fill in the details of your new model."
        submitBtnTitle="Create Model"
        open={showCreateModelModal}
        onClose={() => {
          setShowCreateModelModal(false);
          setNewModel(Model_Update_Dialogue_Initial_State);
        }}
        onSubmit={createModel}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelName" className="text-right">
              Name
            </Label>
            <Input
              id="modelName"
              className="col-span-3"
              name="name"
              value={newModel.name}
              onChange={(e) =>
                setNewModel({ ...newModel, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelDescription" className="text-right">
              Description
            </Label>
            <Textarea
              className="col-span-3"
              id="modelDescription"
              placeholder="Type your description here."
              name="description"
              value={newModel.description}
              onChange={(e) =>
                setNewModel({ ...newModel, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelInferenceTime" className="text-right">
              Inference Time (s)
            </Label>
            <Input
              className="col-span-3"
              id="modelInferenceTime"
              type="number"
              value={newModel.expectedInferenceTime?.replace("s", "")}
              onChange={(e) =>
                setNewModel({
                  ...newModel,
                  expectedInferenceTime: e.target.value + "s",
                })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelVersion" className="text-right">
              Version
            </Label>
            <Input
              id="modelVersion"
              className="col-span-3"
              name="version"
              value={newModel.version}
              onChange={(e) =>
                setNewModel({ ...newModel, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelNetworkName" className="text-right">
              Network Name
            </Label>
            <Input
              id="modelNetworkName"
              className="col-span-3"
              name="networkName"
              value={newModel.networkName}
              onChange={(e) =>
                setNewModel({ ...newModel, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelPath" className="text-right">
              Path
            </Label>
            <Input
              id="modelPath"
              className="col-span-3"
              name="path"
              value={newModel.path}
              onChange={(e) =>
                setNewModel({ ...newModel, [e.target.name]: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="model_accept_file"
            checked={newModel.acceptFile}
            onCheckedChange={(checked) =>
              setNewModel({ ...newModel, acceptFile: !!checked })
            }
          />
          <label
            htmlFor="model_accept_file"
            className="text-sm font-medium leading-none"
          >
            Does model accept file
          </label>
        </div>
      </DialogCustom>

      <DialogCustom
        title={`Update ${modelBeingUpdated?.name}`}
        description="Make changes to your model here. Click save when you're done."
        submitBtnTitle="Save changes"
        open={showUpdateModelModal}
        onClose={() => {
          setShowUpdateModelModal(false);
          setModelBeingUpdate(Model_Update_Dialogue_Initial_State);
        }}
        onSubmit={updateModelsData}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelName" className="text-right">
              Name
            </Label>
            <Input
              id="modelName"
              className="col-span-3"
              name="name"
              value={modelBeingUpdated?.name}
              onChange={(e) =>
                setModelBeingUpdate({
                  ...modelBeingUpdated,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelDescription" className="text-right">
              Description
            </Label>
            <Textarea
              className="col-span-3"
              id="modelDescription"
              placeholder="Type your description here."
              name="description"
              value={modelBeingUpdated?.description}
              onChange={(e) =>
                setModelBeingUpdate({
                  ...modelBeingUpdated,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelInferenceTime" className="text-right">
              Inference Time (s)
            </Label>
            <Input
              className="col-span-3"
              id="modelInferenceTime"
              type="number"
              value={modelBeingUpdated?.expectedInferenceTime?.replace("s", "")}
              onChange={(e) =>
                setModelBeingUpdate({
                  ...modelBeingUpdated,
                  expectedInferenceTime: e.target.value + "s",
                })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelVersion" className="text-right">
              Version
            </Label>
            <Input
              id="modelVersion"
              className="col-span-3"
              name="version"
              value={modelBeingUpdated?.version}
              onChange={(e) =>
                setModelBeingUpdate({
                  ...modelBeingUpdated,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelNetworkName" className="text-right">
              Network Name
            </Label>
            <Input
              id="modelNetworkName"
              className="col-span-3"
              name="networkName"
              value={modelBeingUpdated?.networkName}
              onChange={(e) =>
                setModelBeingUpdate({
                  ...modelBeingUpdated,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelPath" className="text-right">
              Path
            </Label>
            <Input
              id="modelPath"
              className="col-span-3"
              name="path"
              value={modelBeingUpdated?.path}
              onChange={(e) =>
                setModelBeingUpdate({
                  ...modelBeingUpdated,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="model_accept_file"
            checked={modelBeingUpdated?.acceptFile}
            onCheckedChange={(checked) =>
              setModelBeingUpdate({
                ...modelBeingUpdated,
                acceptFile: !!checked,
              })
            }
          />
          <label
            htmlFor="model_accept_file"
            className="text-sm font-medium leading-none"
          >
            Does model accept file
          </label>
        </div>
      </DialogCustom>
    </>
  );
};

export default Page;
