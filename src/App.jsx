import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import fetch from "isomorphic-unfetch"
import queryString from "query-string"
import Layout, { ResultsList, Count } from "./components/Layout"
import SearchBox from "./components/SearchBox"
import ServiceCard from "./components/ServiceCard"
import Skeleton from "./components/ServiceCard/Skeleton"
import Filters from "./components/Filters"
import Filter from "./components/Filter"
import config from "./_config"

const App = () => {

  let history = useHistory()

  const query = queryString.parse(history.location.search)

  const [collection, setCollection] = useState(query.collection)
  const [categories, setCategories] = useState(query.categories ? [].concat(query.categories) : [])
  const [only, setOnly] = useState(query.only ? [].concat(query.only) : [])

  const [results, setResults] = useState(false)

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_HOST}/services?${queryString.stringify(query)}`)
      .then(res => res.json())
      .then(data => setResults(data.content))
  }, [])

  return(
    <Layout
      headerComponents={<>
        <SearchBox
          type={collection}
          setType={setCollection}
        />
      </>}
      sidebarComponents={<>
        <Filters>
          <Filter
            legend="Categories"
            options={config.categories}
            selection={categories}
            setSelection={setCategories}
          />
          <Filter
            legend="Only show"
            options={config.only}
            selection={only}
            setSelection={setOnly}
          />
        </Filters>
      </>}
      mainContentComponents={<>
        <Count>Showing {results.length} results near <strong>XXX</strong></Count>
        <ResultsList>
          {results ?
            results.map(s =>
              <ServiceCard key={s.id} {...s}/>  
            )
          : 
          <Skeleton/>
          }
        </ResultsList>
      </>}
    />
  )
}

export default App