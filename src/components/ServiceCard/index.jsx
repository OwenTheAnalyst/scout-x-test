import React from "react"
import theme from "../_theme"
import styled from "styled-components"
import { truncate } from "../../lib/utils"
import { Link, useLocation } from "@reach/router"

const Outer = styled.li`
    padding: 25px;
    background: ${theme.white};
    box-shadow: 0px 4px 5px ${theme.cardShadow}80;
    margin-bottom: 15px;
    transition: box-shadow 0.2s ease-out;
    position: relative;
    animation: fadeIn 0.2s ease-out;
    /* &:hover{
        box-shadow: 0px 2px 12px ${theme.cardShadow};
    } */
    &:focus-within{
        outline: 3px solid ${theme.focus};
    }
    @keyframes fadeIn{
        from{
            opacity: 0
        }
        to{
            opacity: 1;
        }
    }
`

const StyledLink = styled(Link)`
    color: ${theme.text};
    text-decoration: none;
    &:before{
        content: "";
        display: block;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    }
    &:focus{
        border: 0;
        outline: none;
    }
`

const Name = styled.h3`
    margin-bottom: 10px;
    font-size: 1.3rem;
`

const Description = styled.p`
    color: ${theme.text};
    font-size: 0.9rem;
    margin-bottom: 15px;
    line-height: 1.5;
`

const Footer = styled.footer`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const CategoryTag = styled.span`
    display: inline-block;
    padding: 5px;
    font-size: 0.8rem;
    color: ${theme.link};
    background: ${theme.linkBackground};
    border-radius: 2px;
    margin-right: 7px;
    &:last-of-type{
        margin-right: 15px;
    }
`

const Distance = styled.p`
    display: inline-block;
    font-size: 0.8rem;
    color: ${theme.grey};
`

const ServiceCard = ({
    id,
    name,
    description
}) => {
    const { search } = useLocation()
    return(
        <Outer>
            <StyledLink to={`/service/${id}${search}`}>
                <Name>{name}</Name>
            </StyledLink>
            <Description>{truncate(description, 18)}</Description>
            <Footer>
                <CategoryTag>Category</CategoryTag>
                <Distance>About X miles away</Distance>
            </Footer>
        </Outer>
    )
}


export default ServiceCard