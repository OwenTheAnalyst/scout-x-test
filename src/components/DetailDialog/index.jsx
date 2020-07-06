import React, { useState, useEffect } from "react"
import styled from "styled-components"
import theme from "../_theme"
import fetch from "isomorphic-unfetch"
import { daysSince, buildGoodToKnow, getChildTaxa, truncate } from "../../lib/utils"
import { Helmet } from "react-helmet"
import "@reach/dialog/styles.css"

import A from "../A"
import PinboardButton from "../PinboardButton"
import Description from "../Description"
import LocalOffer from "../LocalOffer"
import Loader from "../Loader"
import { ButtonLink } from "../Button"
import Dialog, { Body as InheritedBody, Header, Title } from "../Dialog"
import SingleLocation from "./SingleLocation"
import LocationAccordion from "./LocationAccordion"
import { TickList, TickListItem } from "../TickList"

const Body = styled(InheritedBody)`
    &:first-of-type{
        padding-top: 0px;
    }
`

const Banner = styled.p`
  background: ${theme.pale};
  padding: 10px 50px;
  font-size: 0.9rem;
  color: ${theme.grey};
  text-align: center;
`

const Caption = styled.p`
    color: ${theme.grey};
    margin-bottom: 10px;
    font-size: 1.1rem;
    @media screen and (min-width: ${theme.breakpointM}){
        font-size: 1.2rem;
    }
`

const Actions = styled.div`
    margin-bottom: 30px;
    a:first-of-type{
        margin-bottom: 25px;
    }
    @media screen and (min-width: ${theme.breakpointM}) {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 40px;
        a:first-of-type{
            margin-bottom: 0px;
            margin-right: 30px;
        }
    }
`

const TwoColumnTickList = styled(TickList)`
    margin-top: 25px;
    list-style: none;
    @media screen and (min-width: ${theme.breakpointM}) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 35px;
    }
`

const Crosshead = styled.h2`
    margin-bottom: 15px;
    color: ${theme.text};
`

const Columns = styled.div`
    margin-bottom: 30px;
    &:last-of-type{
        margin-bottom: 0px;
    }
    div{
        margin-bottom: 20px;
        &:last-of-type{
            margin-bottom: 0px;
        }
    }
    @supports (display: grid){
        @media screen and (min-width: ${theme.breakpointM}) {
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 35px;
            div{
                margin-bottom: 0px;
            }
        }
    }

`

const ContactName = styled.h3`
    line-height: 1.5;
    color: ${theme.text};
`

const ContactRole = styled.p`
    margin-bottom: 5px;
    font-style: italic;
`

const Table = styled.table`
    width: 100%;
    color: ${theme.text};
    td{
        width: 50%;
    }
`

const Footer = styled(Body)`
    text-align: center;
    padding: 25px;
    @media screen and (min-width: ${theme.breakpointM}){
        padding: 45px;
    }
    p{
        margin-bottom: 10px;
        &::last-of-type{
            margin-bottom: 0px;
        }
    }
`

const SuggestEditLink = styled.a`
    display: inline-block;
    text-decoration: none;
    color: ${theme.link};
    padding: 7px 25px;
    text-align: center;
    border: 3px solid ${theme.link};
    font-size: 1rem;
    background: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 200px;
    margin-bottom: 20px;
    &:focus{
        outline: none;
        box-shadow: 0px 0px 0px 3px ${theme.focus};
    }
    &:hover{
        color: ${theme.linkHover};
        border-color: ${theme.linkHover};
    }
    &:active{
        color: ${theme.linkActive};
        border-color: ${theme.linkActive};
    }
`

const DetailDialog = ({
    serviceId,
    location,
    navigate
}) => {

    const [service, setService] = useState(false)
    
    const handleDismiss = () => {
        navigate(`/${location.search}`)
    }

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_HOST}/services/${serviceId}`)
            .then(res => res.json())
            .then(data => setService(data))
    }, [serviceId])

    if(service){

        let goodToKnow = buildGoodToKnow(service)
        let categories = getChildTaxa(service.taxonomies, "Categories", true)

        return(
            <Dialog handleDismiss={handleDismiss} dialogTitle={service.name}>
                <Helmet>
                    <title>{service.name} | Family information service | Buckinghamshire Council</title>
                    {service.description && <meta content={truncate(service.description, 30)} name="description"/>}
                </Helmet>
                {daysSince(service.updated_at) > 180 && 
                    <Banner>Last updated more than six months ago</Banner>
                }
                <Header>
                    {service.organisation.name && 
                        <Caption>{service.organisation.name}</Caption>
                    }
                    <Title>{service.name}</Title>
                </Header>
                {service.locations.length === 1 &&  
                    <SingleLocation {...service.locations[0]}/>
                }
                <Body>
                    <Actions>
                        {service.url ? 
                            <ButtonLink href={service.url}>Visit website</ButtonLink>
                            :
                            (service.contacts.length === 1 && service.contacts[0].email) && 
                                <ButtonLink href={`mailto:${service.contacts[0].email}`}>Send email</ButtonLink>
                        }
                        <PinboardButton service={service}/>
                    </Actions>
                    {service.description && <Description description={service.description}/>}
                    {service.locations.length > 1 && <LocationAccordion locations={service.locations}/>}
                </Body>
                {goodToKnow.length > 0 &&
                    <Body>
                        <Crosshead>Good to know</Crosshead>
                        <TwoColumnTickList>
                            {goodToKnow.map(point =>
                                <TickListItem>
                                    {point}<br/>
                                    {point === "Needs a referral" && service.referral_url &&
                                        <A href={service.referral_url}>Details</A>
                                    }
                                </TickListItem>
                            )}
                        </TwoColumnTickList>
                    </Body>
                }
                {service.contacts.length > 0 &&
                    <Body>
                        <Crosshead>Who to contact</Crosshead>
                        <Columns>
                            {service.contacts.map(contact =>
                                <div key={contact.id}>
                                    <ContactName>{contact.name || service.name}</ContactName>
                                    {contact.title && <ContactRole>{contact.title}</ContactRole>}
                                    {contact.phone && <p>{contact.phone}</p>}
                                    {contact.email && <p><A href={`mailto:${contact.email}`}>{contact.email}</A></p>}
                                </div>
                            )}
                        </Columns>
                    </Body>
                }
                {service.local_offer &&
                    <Body>
                        <Crosshead>Local offer and SEND</Crosshead>
                        <LocalOffer 
                            {...service.local_offer} 
                            taxonomies={service.taxonomies}
                        />
                    </Body>
                }
                <Body>
                    {service.locations.length === 1 && service.locations[0].accessibilities.length > 0 && 
                        <Columns>
                            <Crosshead>Accessibility</Crosshead>
                            <TickList>
                                {service.locations[0].accessibilities.map(point =>
                                    <TickListItem key={point.name}>{point.name}</TickListItem>    
                                )}
                            </TickList>
                        </Columns>
                    }
                    {service.regular_schedules.length > 0 &&
                        <Columns>
                            <Crosshead>Hours</Crosshead>
                            <Table>
                                <tbody>
                                    {service.regular_schedules.map((sched, i) =>
                                        <tr key={i}>
                                            <td><strong>{sched.weekday}s</strong></td>
                                            <td>{sched.opens_at}—{sched.closes_at}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Columns>
                    }
                    {service.cost_options.length > 0 &&
                        <Columns>
                            <Crosshead>Fees</Crosshead>
                            <Table>
                                <tbody>
                                    {service.cost_options.map((fee, i) =>
                                        <tr key={i}>
                                            <td><strong>{fee.option}</strong></td>
                                            <td>£{fee.amount}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Columns>
                    }
                    {(service.facebook_url || service.twitter_url || service.youtube_url || service.instagram_url || service.linkedin_url) &&
                        <Columns>
                            <Crosshead>Social links</Crosshead>
                            <div>
                                {service.facebook_url && <p><A href={service.facebook_url}>Facebook</A></p>}
                                {service.twitter_url && <p><A href={service.twitter_url}>Twitter</A></p>}                        
                                {service.youtube_url && <p><A href={service.youtube_url}>YouTube</A></p>}                        
                                {service.instagram_url && <p><A href={service.instagram_url}>Instagram</A></p>}                        
                                {service.linkedin_url && <p><A href={service.linkedin_url}>LinkedIn</A></p>}
                            </div>
                        </Columns>
                    }
                    {categories.length > 0 &&
                        <Columns>
                            <Crosshead>Categories</Crosshead>
                            <p>{categories.map(taxon => taxon.name).join(", ")}</p>
                        </Columns>
                    }
                </Body>
                <Footer>
                    <SuggestEditLink target="blank" href={`https://outpost-staging.herokuapp.com/services/${service.id}/feedback`}>Suggest an edit</SuggestEditLink>
                    <p>If anything here is out of date or missing, please suggest an edit.</p>
                    <p>We regularly check and update these community services, but can’t guarantee that they will always be accurate.</p>
                    <p>You may need a referral for some activities and groups. Contact the organiser if unsure.</p>
                </Footer>
            </Dialog>
        )
    }
    return <Loader/>
}

export default DetailDialog