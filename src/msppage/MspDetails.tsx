import { useEffect, useState } from 'react'
import { Grid, Stack } from '@mui/material'
import { PrimaryButton, SecondaryButton } from '../components/buttons'
import { FormSection } from '../components/form'
import { useValidate, type ValidationErrors } from '../components/hooks'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setActiveTab, setMspDetailsValues } from '../store/mspWizardSlice'
import { FORM_FIELDS, splitFieldsInHalf } from './config'
import type { FormValues } from './types'
import { useLocationOptions } from '../services/useLocationOptions'
import { BASE_URL } from '../services/locationApi'

interface Props {
    baseUrl?: string
}

const PHONE_PATTERN = /^\+\d{1,13}$/
const ZIP_PATTERN = /^\d{6}$/

const validateMspDetails = (values: FormValues): ValidationErrors<FormValues> => {
    const errors: ValidationErrors<FormValues> = {}

    if (!values.company) errors.company = 'company is required'
    if (!values.name) errors.name = 'name is required'
    if (!values.country) errors.country = 'country is required'
    if (!values.state) errors.state = 'state is required'
    if (!values.city) errors.city = 'city is required'
    if (!values.zip) errors.zip = 'zip is required'
    if (values.zip && !ZIP_PATTERN.test(values.zip)) errors.zip = 'zip must be 6 digits'

    ;(['phone-office', 'phone-home', 'cell'] as const).forEach((key) => {
        const value = values[key]
        if (value && !PHONE_PATTERN.test(value)) {
            errors[key] = `${key} must be in +countrycode format`
        }
    })

    return errors
}

const MspDetails: React.FC<Props> = ({
    baseUrl = BASE_URL
}) => {
    const dispatch = useAppDispatch()
    const formValues = useAppSelector((state) => state.mspWizard.mspDetailsValues)
    const [submitAttempted, setSubmitAttempted] = useState(false)

    const { companies, countries, states, cities, loadingCompanies, loadingCountries, loadingStates, loadingCities } = useLocationOptions({
        baseUrl,
        selectedCountry: formValues.country ?? '',
        selectedState: formValues.state ?? ''
    })
    const { errors, validate } = useValidate(formValues, validateMspDetails)

    const handleChange = (name: string, value: string) => {
        const next: FormValues = { ...formValues, [name]: value }
        if (name === 'country') {
            next.state = ''
            next.city = ''
        }
        if (name === 'state') {
            next.city = ''
        }
        dispatch(setMspDetailsValues(next))
    }

    const [leftColumnFields, rightColumnFields] = splitFieldsInHalf(FORM_FIELDS)

    useEffect(() => {
        if (submitAttempted) {
            validate()
        }
    }, [formValues, submitAttempted, validate])

    const handleNextClick = () => {
        setSubmitAttempted(true)
        if (validate()) {
            dispatch(setActiveTab('billing'))
        }
    }

    return (
        <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} md={6}>
                <FormSection
                    fields={leftColumnFields}
                    formValues={formValues}
                    errors={submitAttempted ? errors : {}}
                    companies={companies}
                    countries={countries}
                    states={states}
                    cities={cities}
                    loadingCompanies={loadingCompanies}
                    loadingCountries={loadingCountries}
                    loadingStates={loadingStates}
                    loadingCities={loadingCities}
                    onChange={handleChange}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <FormSection
                    fields={rightColumnFields}
                    formValues={formValues}
                    errors={submitAttempted ? errors : {}}
                    companies={companies}
                    countries={countries}
                    states={states}
                    cities={cities}
                    loadingCompanies={loadingCompanies}
                    loadingCountries={loadingCountries}
                    loadingStates={loadingStates}
                    loadingCities={loadingCities}
                    onChange={handleChange}
                />
            </Grid>

            <Grid item xs={12}>
                <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 1 }}>
                    <SecondaryButton onClick={() => dispatch(setActiveTab('details'))}>back</SecondaryButton>
                    <PrimaryButton onClick={handleNextClick}>next</PrimaryButton>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default MspDetails
