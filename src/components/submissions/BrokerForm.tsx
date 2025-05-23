"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextInput, ComboBox, Grid, Column } from "@carbon/react";
import { stateList } from "@/data/stateList";
import styles from "@/styles/pages/submissions.module.scss";

interface BrokerFormProps {
  application: any;
  onUpdate: (application: any) => void;
  onNext: () => void;
}

const schema = yup.object({
  name: yup
    .string()
    .matches(/^[A-Za-z\s]*$/, "Name cannot contain numbers")
    .required("Broker Name is required"),
  organization: yup
    .string()
    .matches(/^[A-Za-z\s]*$/, "Organization name cannot contain numbers")
    .required("Organization Name is required"),
  address: yup.string().required("Organization Address is required"),
  city: yup
    .string()
    .matches(/^[A-Za-z\s]*$/, "City name cannot contain numbers")
    .required("Organization City is required"),
  state: yup
    .string()
    .oneOf(stateList, "Select a valid state")
    .required("State is required"),
  zipcode: yup
    .string()
    .matches(/^\d{5}$/, "Zipcode must be exactly 5 digits")
    .required("Zipcode is required"),
});

function BrokerForm({ application, onUpdate, onNext }: BrokerFormProps) {
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
      name: application.broker.name || "",
      organization: application.broker.organization || "",
      address: application.broker.address || "",
      city: application.broker.city || "",
      state: application.broker.state || "",
      zipcode: application.broker.zipcode || "",
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
        broker: {
          ...values,
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
            <label htmlFor="broker_name-input" className={styles.label}>
              Broker Name
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="broker_name-input"
                  placeholder="Enter Broker Name"
                  {...field}
                  labelText=""
                  invalid={!!errors.name}
                  invalidText={errors.name?.message as string}
                  className={styles.input}
                />
              )}
            />
          </div>
          <div className={styles.formRow}>
            <label
              htmlFor="broker_organization_name-input"
              className={styles.label}
            >
              Organization Name
            </label>
            <Controller
              name="organization"
              control={control}
              render={({ field }) => (
                <TextInput
                  labelText={""}
                  id="broker_organization_name-input"
                  placeholder="Enter Organization Name"
                  {...field}
                  invalid={!!errors.organization}
                  invalidText={errors.organization?.message as string}
                  className={styles.input}
                />
              )}
            />
          </div>
          <div className={styles.formRow}>
            <label
              htmlFor="broker_organization_address-input"
              className={styles.label}
            >
              Address
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextInput
                  labelText={""}
                  id="broker_organization_address-input"
                  placeholder="Enter Organization Address"
                  {...field}
                  invalid={!!errors.address}
                  invalidText={errors.address?.message as string}
                  className={styles.input}
                />
              )}
            />
          </div>
          <div className={styles.formRow}>
            <label
              htmlFor="broker_organization_city-input"
              className={styles.label}
            >
              City
            </label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextInput
                  labelText={""}
                  id="broker_organization_city-input"
                  placeholder="Enter Organization City"
                  {...field}
                  invalid={!!errors.city}
                  invalidText={errors.city?.message as string}
                  className={styles.input}
                />
              )}
            />
          </div>
          <div className={styles.formRow}>
            <label
              htmlFor="broker_organization_zipcode-input"
              className={styles.label}
            >
              Zipcode
            </label>
            <Controller
              name="zipcode"
              control={control}
              render={({ field }) => (
                <TextInput
                  id="broker_organization_zipcode-input"
                  placeholder="Enter Zip Code | 5 Digits"
                  {...field}
                  labelText=""
                  invalid={!!errors.zipcode}
                  invalidText={errors.zipcode?.message as string}
                  className={styles.input}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d{0,5}$/.test(val)) {
                      field.onChange(val);
                    }
                  }}
                />
              )}
            />
          </div>
          <div className={styles.formRow}>
            <label
              htmlFor="broker_organization_state-input"
              className={styles.label}
            >
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
        </form>
      </Column>
    </Grid>
  );
}

export default BrokerForm;
