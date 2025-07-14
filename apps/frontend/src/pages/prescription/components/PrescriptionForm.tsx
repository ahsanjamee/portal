import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Select as MantineSelect } from "@mantine/core";
import { Textarea } from "@/components/ui/textarea";
import UploadImage from "@/components/ui/UploadImage";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@mantine/dates";
import { Minus, Plus } from "@phosphor-icons/react";
import React, { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import type { PrescriptionResponseDto } from "@portal/portal-api-client";

// Validation schema
const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  instructions: z.string().min(1, "Instructions are required"),
  duration: z.string().min(1, "Duration is required"),
});

const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Patient selection is required"),
  animalType: z.string().min(1, "Animal type is required"),
  animalPicture: z.string().optional(),
  patientNumber: z.number().min(0).nullable().optional(),
  age: z.string().optional(),
  sex: z.string().optional(),
  weight: z.number().min(0).nullable().optional(),

  // Vital Signs
  temperature: z.string().optional(),
  spo2: z.string().optional(),
  respirationRate: z.string().optional(),
  fecesStatus: z.string().optional(),
  nasalSecretion: z.string().optional(),
  feedingHistory: z.string().optional(),

  // Medical History
  medicationHistory: z.string().optional(),
  investigation: z.string().optional(),

  // Prescription Details
  medications: z
    .array(medicationSchema)
    .min(1, "At least one medication is required"),
  advice: z.string().optional(),

  // Consultation Details
  consultancyFee: z.number().min(0).nullable().optional(),
  followUpDate: z.date().optional(),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

type PrescriptionFormProps = {
  onSubmit: (data: PrescriptionFormData) => void;
  loading?: boolean;
  patients?: Array<{
    id: string;
    name: string;
    userType: string;
    address: string;
    photo?: string;
    farmData?: any;
    mobileNumber?: string;
  }>;
  initialData?: PrescriptionResponseDto;
  isEditMode?: boolean;
  setActiveTab?: (val: "list" | "create" | "edit") => void;
};

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  onSubmit,
  loading = false,
  patients = [],
  initialData,
  isEditMode = false,
  setActiveTab = () => {},
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medications: [{ name: "", dosage: "", instructions: "", duration: "" }],
      patientNumber: 0,
      weight: 0,
      consultancyFee: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medications",
  });

  const selectedPatientId = watch("patientId");
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const animalPicture = watch("animalPicture");

  // Populate form with initial data in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setValue("patientId", initialData.patientId);
      setValue("animalType", initialData.animalType);
      setValue("animalPicture", initialData.animalPicture || "");
      setValue("patientNumber", initialData.patientNumber);
      setValue("age", initialData.age || "");
      setValue("sex", initialData.sex || "");
      setValue("weight", initialData.weight || 0);
      setValue("temperature", initialData.temperature || "");
      setValue("spo2", initialData.spo2 || "");
      setValue("respirationRate", initialData.respirationRate || "");
      setValue("fecesStatus", initialData.fecesStatus || "");
      setValue("nasalSecretion", initialData.nasalSecretion || "");
      setValue("feedingHistory", initialData.feedingHistory || "");
      setValue("medicationHistory", initialData.medicationHistory || "");
      setValue("investigation", initialData.investigation || "");
      setValue(
        "medications",
        initialData.medications || [
          { name: "", dosage: "", instructions: "", duration: "" },
        ]
      );
      setValue("advice", initialData.advice || "");
      setValue("consultancyFee", initialData.consultancyFee || 0);
      setValue(
        "followUpDate",
        initialData.followUpDate
          ? new Date(initialData.followUpDate)
          : undefined
      );
    }
  }, [isEditMode, initialData, setValue, initialData?.id]);

  const handleFormSubmit = (data: PrescriptionFormData) => {
    onSubmit({
      ...data,
      animalPicture: data.animalPicture ?? "",
      age: data.age ?? "",
      weight: data.weight ?? null,
      patientNumber: data.patientNumber ?? null,
      consultancyFee: data.consultancyFee ?? null,
      sex: data.sex ?? "",
      temperature: data.temperature ?? "",
      spo2: data.spo2 ?? "",
      respirationRate: data.respirationRate ?? "",
      fecesStatus: data.fecesStatus ?? "",
      nasalSecretion: data.nasalSecretion ?? "",
      feedingHistory: data.feedingHistory ?? "",
      medicationHistory: data.medicationHistory ?? "",
      investigation: data.investigation ?? "",
      advice: data.advice ?? "",
      followUpDate: data.followUpDate ?? undefined,
    });
  };

  const addMedication = () => {
    append({ name: "", dosage: "", instructions: "", duration: "" });
  };

  const removeMedication = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-0 lg:p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-700">
            {isEditMode ? "Edit Prescription" : "Create New Prescription"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 lg:p-6">
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-1 lg:space-y-6"
          >
            {/* Patient Selection */}
            <Card className="shadow-none lg:shadow-md border-none lg:border">
              <CardHeader>
                <CardTitle className="text-lg">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="patientId">Select Patient *</Label>
                  <Controller
                    name="patientId"
                    control={control}
                    render={({ field }) => (
                      <MantineSelect
                        placeholder="Select a patient"
                        data={patients.map((patient) => ({
                          value: patient.id,
                          label: `${patient.name} - (${patient.mobileNumber})`,
                        }))}
                        {...field}
                        onChange={(value) => field.onChange(value)}
                        searchable
                        clearable={false}
                      />
                    )}
                  />
                  {errors.patientId && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.patientId.message}
                    </p>
                  )}
                </div>

                {selectedPatient && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold">Selected Patient Details:</h4>
                    <p>
                      <strong>Name:</strong> {selectedPatient.name}
                    </p>
                    <p>
                      <strong>Type:</strong> {selectedPatient.userType}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedPatient.address}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Animal Information */}
            <Card className="shadow-none lg:shadow-md border-none lg:border">
              <CardHeader>
                <CardTitle className="text-lg">Animal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="animalType">Animal Type *</Label>
                    <Controller
                      name="animalType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select animal type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Calf">Calf</SelectItem>
                            <SelectItem value="Cow">Cow</SelectItem>
                            <SelectItem value="Bull">Bull</SelectItem>
                            <SelectItem value="Goat">Goat</SelectItem>
                            <SelectItem value="Sheep">Sheep</SelectItem>
                            <SelectItem value="Chicken">Chicken</SelectItem>
                            <SelectItem value="Duck">Duck</SelectItem>
                            <SelectItem value="Fish">Fish</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.animalType && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.animalType.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="patientNumber">Patient Number</Label>
                    <Controller
                      name="patientNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="Enter patient number"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Controller
                      name="age"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Enter age" />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="sex">Sex</Label>
                    <Controller
                      name="sex"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">Male</SelectItem>
                            <SelectItem value="F">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Controller
                      name="weight"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="Enter weight"
                          value={field.value ?? ""}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="animalPicture">Animal Picture</Label>
                  <UploadImage
                    file={animalPicture || ""}
                    setFile={(url: string) => setValue("animalPicture", url)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Vital Signs */}
            <Card className="shadow-none lg:shadow-md border-none lg:border">
              <CardHeader>
                <CardTitle className="text-lg">Vital Signs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="temperature">Temperature (°F)</Label>
                    <Controller
                      name="temperature"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g., Normal, 102°F" />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="spo2">SpO2 (%)</Label>
                    <Controller
                      name="spo2"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g., 95" />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="respirationRate">Respiration Rate</Label>
                    <Controller
                      name="respirationRate"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g., Normal" />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="fecesStatus">Feces Status</Label>
                    <Controller
                      name="fecesStatus"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g., Normal" />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="nasalSecretion">Nasal Secretion</Label>
                    <Controller
                      name="nasalSecretion"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g., Normal" />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="feedingHistory">Feeding History</Label>
                    <Controller
                      name="feedingHistory"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="e.g., Grass, Straw, Mixed feed"
                        />
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical History */}
            <Card className="shadow-none lg:shadow-md border-none lg:border">
              <CardHeader>
                <CardTitle className="text-lg">Medical History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="medicationHistory">Medication History</Label>
                  <Controller
                    name="medicationHistory"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Previous medications and treatments"
                        rows={3}
                      />
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="investigation">Investigation</Label>
                  <Controller
                    name="investigation"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Any investigations or tests performed"
                        rows={3}
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Medications */}
            <Card className="shadow-none lg:shadow-md border-none lg:border">
              <CardHeader>
                <CardTitle className="text-lg">Medications *</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">
                          Medication {index + 1}
                        </h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeMedication(index)}
                          >
                            <Minus size={16} />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`medications.${index}.name`}>
                            Medication Name *
                          </Label>
                          <Controller
                            name={`medications.${index}.name`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="e.g., Buphos-Vet Injection"
                              />
                            )}
                          />
                          {errors.medications?.[index]?.name && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.medications[index]?.name?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor={`medications.${index}.dosage`}>
                            Dosage *
                          </Label>
                          <Controller
                            name={`medications.${index}.dosage`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="e.g., 100 ml X 1"
                              />
                            )}
                          />
                          {errors.medications?.[index]?.dosage && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.medications[index]?.dosage?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor={`medications.${index}.instructions`}>
                            Instructions *
                          </Label>
                          <Controller
                            name={`medications.${index}.instructions`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="e.g., 5 ml যাহাপেশে ইনজেকশন"
                              />
                            )}
                          />
                          {errors.medications?.[index]?.instructions && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.medications[index]?.instructions?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor={`medications.${index}.duration`}>
                            Duration *
                          </Label>
                          <Controller
                            name={`medications.${index}.duration`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="e.g., 1 বার, মোট 5 দিন"
                              />
                            )}
                          />
                          {errors.medications?.[index]?.duration && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.medications[index]?.duration?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addMedication}
                    className="w-full"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Medication
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Consultation Details */}
            <Card className="shadow-none lg:shadow-md border-none lg:border">
              <CardHeader>
                <CardTitle className="text-lg">Consultation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="consultancyFee">Consultancy Fee (Tk)</Label>
                    <Controller
                      name="consultancyFee"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="Enter consultation fee"
                          value={field.value ?? ""}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="followUpDate">Follow-up Date</Label>
                    <Controller
                      name="followUpDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          minDate={new Date()}
                          //   placeholder="Select follow-up date"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="advice">Advice</Label>
                  <Controller
                    name="advice"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Doctor's advice and recommendations"
                        rows={4}
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex flex-col lg:flex-row gap-4 items-center pb-6 justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("list")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update Prescription"
                    : "Create Prescription"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
