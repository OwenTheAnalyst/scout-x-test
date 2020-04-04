import React from "react"
import theme from "../_theme"
import styled from "styled-components"
import search from "./search.svg"
import config from "../../_config"


const Form = styled.form`
    @media screen and (min-width: ${theme.breakpointM}){
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        width: 100%;
    }
`

const Field = styled.div`
    margin-bottom: 15px;
    @media screen and (min-width: ${theme.breakpointM}){
        margin-bottom: 0px;
        margin-right: 20px;
        flex: 1;
    }
`

const Label = styled.label`
    margin-bottom: 5px;
    display: inline-block;
`

const Select = styled.select`
    font-size: 1rem;
    padding: 10px;
    border: 2px solid ${theme.text};
    display: block;
    width: 100%;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg fill='none' height='31' viewBox='0 0 42 31' width='42' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m0 0h42v31h-42z' fill='%23fff'/%3E%3Cpath clip-rule='evenodd' d='m20.9393 21-9.0606-9.0607 2.1213-2.12128 6.9393 6.93938 6.9394-6.93938 2.1213 2.12128z' fill='%23212121' fill-rule='evenodd'/%3E%3C/svg%3E");
    background-position: center right;
    background-repeat: no-repeat;
    padding-right: 45px;
    height: 45px;
    &:focus{
        outline: 3px solid ${theme.focus};
    }
`

const Input = styled.input`
    font-size: 1rem;
    padding: 10px;
    border: 2px solid ${theme.text};
    display: block;
    width: 100%;
    height: 45px;
    &:focus{
        outline: 3px solid ${theme.focus};
    }
    &:placeholder{
        opacity: 0.25;
    }
`

const Button = styled.button`
    background: ${theme.link};
    border: none;
    text-align: center;
    width: 100%;
    padding: 10px 20px;
    cursor: pointer;
    height: 45px;
    &:hover{
        background: ${theme.linkHover};
    }
    &:focus{
        outline: 3px solid ${theme.focus};
    }
    &:active{
        background: ${theme.linkActive};
    }
    @media screen and (min-width: ${theme.breakpointM}){
        width: 100px;
    }
`

const SearchBox = () =>
        <Form>

            <Field>
                <Label for="type">What</Label>
                <Select name="type" id="type">
                    {config.types.map(type =>
                        <option 
                            key={type.value} 
                            value={type.value}
                        >{type.label}</option>
                    )}
                </Select>
            </Field>

            <Field>
                <Label for="location">Where</Label>
                <Input 
                    name="location" 
                    id="location"
                    placeholder="Town or postcode"
                />
            </Field>

            <Button>
                <img src={search} alt="search"/>
            </Button>
        </Form>

export default SearchBox