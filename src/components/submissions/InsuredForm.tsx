"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextInput,
  Select,
  SelectItem,
  Grid,
  Column,
  Button,
  ComboBox,
} from "@carbon/react";
import { stateList } from "@/data/stateList";
import styles from "@/styles/pages/submissions.module.scss";
import { ArrowRight } from "@carbon/icons-react";

interface InsuredFormProps {
  application: any;
  onUpdate: (application: any) => void;
  onNext: () => void;
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

function InsuredForm({ application, onUpdate, onNext }: InsuredFormProps) {
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
      setFilteredStates(filtered);
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
    <Grid className={styles.formGrid}>
      <Column sm={4} md={8} lg={12}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className={styles.formRow}>
            <label htmlFor="applicant_name-input" className={styles.label}>
              Name
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextInput
                  labelText={""} id="applicant_name-input"
                  placeholder="Enter Applicant Name"
                  {...field}
                  invalid={!!errors.name}
                  invalidText={errors.name?.message as string}
                  className={styles.input}                />
              )}
            />
          </div>

          <div className={styles.formRow}>
            <label htmlFor="applicant_address-input" className={styles.label}>
              Address
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextInput
                  labelText={""} id="applicant_address-input"
                  placeholder="Enter Applicant Address"
                  {...field}
                  invalid={!!errors.address}
                  invalidText={errors.address?.message as string}
                  className={styles.input}                />
              )}
            />
          </div>

          <div className={styles.formRow}>
            <label htmlFor="applicant_city-input" className={styles.label}>
              City
            </label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextInput
                  labelText={""} id="applicant_city-input"
                  placeholder="Enter Applicant City"
                  {...field}
                  invalid={!!errors.city}
                  invalidText={errors.city?.message as string}
                  className={styles.input}                />
              )}
            />
          </div>

          <div className={styles.formRow}>
            <label htmlFor="applicant_state-input" className={styles.label}>
              State
            </label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <ComboBox
                  id="broker_organization_state-input"
                  items={filteredStates}
                  placeholder="Select a state"
                  selectedItem={field.value}
                  onChange={({ selectedItem }) =>
                    field.onChange(selectedItem || "")
                  }
                  onInputChange={(input) => {
                    handleStateInputChange(input);
                  }}
                  className={styles.input}
                  invalid={!!errors.state}
                  invalidText={errors.state?.message as string}
                />
              )}
            />
          </div>

          <div className={styles.formRow}>
            <label htmlFor="applicant_zipcode-input" className={styles.label}>
              Zipcode
            </label>
            <Controller
              name="zipcode"
              control={control}
              render={({ field }) => (
                <TextInput
                  labelText={""} id="applicant_zipcode-input"
                  placeholder="Enter Zip Code | 5 Digits"
                  {...field}
                  invalid={!!errors.zipcode}
                  invalidText={errors.zipcode?.message as string}
                  className={styles.input}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d{0,5}$/.test(val)) {
                      field.onChange(val);
                    }
                  } }                />
              )}
            />
          </div>

          <div className={styles.formRow}>
            <label htmlFor="applicant_naics-input" className={styles.label}>
              NAICS
            </label>
            <Controller
              name="naics"
              control={control}
              render={({ field }) => (
                <TextInput
                  labelText={""} id="applicant_naics-input"
                  placeholder="Enter 6 Digit NAICS"
                  {...field}
                  invalid={!!errors.naics}
                  invalidText={errors.naics?.message as string}
                  className={styles.input}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d{0,6}$/.test(val)) {
                      field.onChange(val);
                    }
                  } }                />
              )}
            />
          </div>
        </form>
      </Column>
    </Grid>
  );
}

export default InsuredForm;
