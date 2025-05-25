"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, TextInput, ComboBox, Grid, Column } from "@carbon/react";
import { ArrowLeft, ArrowRight } from "@carbon/icons-react";
import { stateList } from "@/data/stateList";
import styles from "@/styles/pages/submissions.module.scss";

interface InsuredFormProps {
  application: any;
  onUpdate: (application: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const schema = yup.object({
  name: yup
    .string()
    .matches(/^[A-Za-z\s]*$/, "Name cannot contain numbers")
    .required("Applicant Name is required"),
  address: yup.string().required("Address is required"),
  city: yup
    .string()
    .matches(/^[A-Za-z\s]*$/, "City name cannot contain numbers")
    .required("City is required"),
  state: yup
    .string()
    .oneOf(stateList, "Select a valid state")
    .required("State is required"),
  zipcode: yup
    .string()
    .matches(/^\d{5}$/, "Zipcode must be exactly 5 digits")
    .required("Zipcode is required"),
  naics: yup
    .string()
    .matches(/^\d{6}$/, "NAICS must be exactly 6 digits")
    .required("NAICS is required"),
});

function InsuredForm({
  application,
  onUpdate,
  onNext,
  onBack,
}: InsuredFormProps) {
  const [filteredStates, setFilteredStates] = useState(stateList);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      name: application.insured.name || "",
      address: application.insured.address || "",
      city: application.insured.city || "",
      state: application.insured.state || "",
      zipcode: application.insured.zipcode || "",
      naics: application.insured.naics?.[0] || "",
    },
  });

  const handleStateInputChange = (input: string) => {
    if (!input) {
      setFilteredStates(stateList);
    } else {
      const filtered = stateList.filter((state) =>
        state.toLowerCase().startsWith(input.toLowerCase())
      );
      setFilteredStates(filtered.length ? filtered : ["No matches found"]);
    }
  };

  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate({
        ...application,
        insured: {
          ...values,
          naics: [values.naics],
        },
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate, application]);

  const onSubmit = () => {
    onNext();
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Insured information form"
    >
      <Grid condensed className={styles.grid}>
        <Column sm={4} md={8} lg={4} className={styles.formColumn}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextInput
                id="applicant_name-input"
                labelText="Name"
                placeholder="Enter Applicant Name"
                {...field}
                invalid={!!errors.name}
                invalidText={errors.name?.message as string}
                light={false}
              />
            )}
          />
        </Column>

        <Column sm={4} md={8} lg={8} className={styles.formColumn}>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextInput
                id="applicant_address-input"
                labelText="Address"
                placeholder="Enter Applicant Address"
                {...field}
                invalid={!!errors.address}
                invalidText={errors.address?.message as string}
                light={false}
              />
            )}
          />
        </Column>

        <Column sm={4} md={8} lg={4} className={styles.formColumn}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextInput
                id="applicant_city-input"
                labelText="City"
                placeholder="Enter City"
                {...field}
                invalid={!!errors.city}
                invalidText={errors.city?.message as string}
                light={false}
              />
            )}
          />
        </Column>

        <Column sm={4} md={8} lg={4} className={styles.formColumn}>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <>
                <label htmlFor="applicant_state-input" className={styles.label}>
                  State
                </label>
                <ComboBox
                  id="applicant_state-input"
                  items={filteredStates}
                  placeholder="Select a state"
                  selectedItem={field.value}
                  onChange={({ selectedItem }) =>
                    field.onChange(selectedItem || "")
                  }
                  onInputChange={handleStateInputChange}
                  invalid={!!errors.state}
                  invalidText={errors.state?.message as string}
                  aria-label="State"
                />
              </>
            )}
          />
        </Column>

        <Column sm={4} md={8} lg={4} className={styles.formColumn}>
          <Controller
            name="zipcode"
            control={control}
            render={({ field }) => (
              <TextInput
                id="applicant_zipcode-input"
                labelText="Zipcode"
                placeholder="Enter Zip Code | 5 Digits"
                {...field}
                invalid={!!errors.zipcode}
                invalidText={errors.zipcode?.message as string}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,5}$/.test(val)) {
                    field.onChange(val);
                  }
                }}
                light={false}
              />
            )}
          />
        </Column>

        <Column sm={4} md={8} lg={4} className={styles.formColumn}>
          <Controller
            name="naics"
            control={control}
            render={({ field }) => (
              <TextInput
                id="applicant_naics-input"
                labelText="NAICS"
                placeholder="Enter 6 Digit NAICS"
                {...field}
                invalid={!!errors.naics}
                invalidText={errors.naics?.message as string}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,6}$/.test(val)) {
                    field.onChange(val);
                  }
                }}
                light={false}
              />
            )}
          />
        </Column>
      </Grid>
      <div className={styles.formFooter}>
        <Button kind="secondary" renderIcon={ArrowLeft} onClick={onBack}>
          Back
        </Button>
        <Button kind="primary" renderIcon={ArrowRight} type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}

export default InsuredForm;
