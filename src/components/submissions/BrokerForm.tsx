"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextInput, ComboBox, Grid, Column, Button } from "@carbon/react";
import { ArrowRight } from "@carbon/icons-react";
import { stateList } from "@/constants/stateList";
import styles from "@/styles/pages/submissions.module.scss";
import { Application, Broker } from "@/types/application";

interface BrokerFormProps {
  application: Application;
  onUpdate: (application: Application) => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
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
    setValue,
    formState: { errors },
  } = useForm<Broker>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      name: application.broker.name,
      organization: application.broker.organization,
      address: application.broker.address,
      city: application.broker.city,
      state: application.broker.state,
      zipcode: application.broker.zipcode,
    },
  });

  useEffect(() => {
    setValue("name", application.broker.name);
    setValue("organization", application.broker.organization);
    setValue("address", application.broker.address);
    setValue("city", application.broker.city);
    setValue("state", application.broker.state);
    setValue("zipcode", application.broker.zipcode);
  }, [application, setValue]);

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
      const updatedBroker: Broker = {
        name: values.name ?? "",
        organization: values.organization ?? "",
        address: values.address ?? "",
        city: values.city ?? "",
        state: values.state ?? "",
        zipcode: values.zipcode ?? "",
      };
      const updatedApp: Application = {
        ...application,
        broker: updatedBroker,
      };
      sessionStorage.setItem("APPLICATION_DATA", JSON.stringify(updatedApp));
      onUpdate(updatedApp);
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate, application]);

  const onSubmit = () => {
    onNext();
  };

  useEffect(() => {
    const storedData = sessionStorage.getItem("APPLICATION_DATA");
    if (storedData) {
      try {
        const parsedApp = JSON.parse(storedData);
        if (parsedApp?.broker) {
          setValue("name", parsedApp.broker.name);
          setValue("organization", parsedApp.broker.organization);
          setValue("address", parsedApp.broker.address);
          setValue("city", parsedApp.broker.city);
          setValue("state", parsedApp.broker.state);
          setValue("zipcode", parsedApp.broker.zipcode);
        }
      } catch (e) {
        console.error("Failed to parse stored application data", e);
      }
    }
  }, [setValue]);

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Broker information form"
    >
      <Grid condensed className={styles.grid}>
        <Column sm={4} md={8} lg={5} className={styles.formColumn}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextInput
                id="broker_name-input"
                labelText="Broker Name"
                placeholder="Enter Broker Name"
                {...field}
                invalid={!!errors.name}
                invalidText={errors.name?.message as string}
                light={false}
              />
            )}
          />
        </Column>
        <Column sm={4} md={8} lg={7} className={styles.formColumn}>
          <Controller
            name="organization"
            control={control}
            render={({ field }) => (
              <TextInput
                id="broker_organization_name-input"
                labelText="Organization Name"
                placeholder="Enter Organization Name"
                {...field}
                invalid={!!errors.organization}
                invalidText={errors.organization?.message as string}
                light={false}
              />
            )}
          />
        </Column>
        <Column sm={4} md={8} lg={12} className={styles.formColumn}>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextInput
                id="broker_organization_address-input"
                labelText="Address"
                placeholder="Enter Organization Address"
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
                id="broker_organization_city-input"
                labelText="City"
                placeholder="Enter Organization City"
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
                <label
                  htmlFor="broker_organization_state-input"
                  className={styles.label}
                >
                  State
                </label>
                <ComboBox
                  id="broker_organization_state-input"
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
                id="broker_organization_zipcode-input"
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
      </Grid>
      <div className={styles.formFooter}>
        <Button kind="primary" renderIcon={ArrowRight} type="submit">
          Next
        </Button>
      </div>
    </form>
  );
}

export default BrokerForm;
