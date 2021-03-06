/* global cozy */
import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'

import ApplicationRouting from './ApplicationRouting'
import Sections from './Sections'
import AppsLoading from 'ducks/components/AppsLoading'

import getFilteredAppsFromSearch from 'lib/getFilteredAppsFromSearch'

const { BarCenter } = cozy.bar

export class MyApplications extends Component {
  constructor(props) {
    super(props)
    this.onAppClick = this.onAppClick.bind(this)
    this.pushQuery = this.pushQuery.bind(this)
  }

  onAppClick(appSlug) {
    this.props.history.push(`/myapps/${appSlug}`)
  }

  pushQuery(query) {
    if (!query) return this.props.history.push('/myapps')
    this.props.history.push(`/myapps?${query}`)
  }

  render() {
    const {
      t,
      location,
      installedApps,
      isFetching,
      isAppFetching,
      fetchError,
      actionError,
      breakpoints = {}
    } = this.props
    const { isMobile } = breakpoints
    const query = !!location && location.search
    const filteredApps = getFilteredAppsFromSearch(installedApps, query)
    const title = <h2 className="sto-view-title">{t('myapps.title')}</h2>
    return (
      <div className="sto-myapps">
        {this.props.match.isExact ? (
          <div>
            {isMobile && <BarCenter>{title}</BarCenter>}
            <div className="sto-myapps-sections">
              {!isFetching && (
                <Sections
                  apps={filteredApps}
                  allApps={installedApps}
                  error={fetchError}
                  onAppClick={this.onAppClick}
                  pushQuery={this.pushQuery}
                  query={query}
                />
              )}
            </div>
          </div>
        ) : null}

        <ApplicationRouting
          installedApps={filteredApps}
          isFetching={isFetching}
          isAppFetching={isAppFetching}
          actionError={actionError}
          installApp={this.props.installApp}
          uninstallApp={this.props.uninstallApp}
          updateApp={this.props.updateApp}
          fetchLatestApp={this.props.fetchLatestApp}
          parent="myapps"
        />

        {isFetching && <AppsLoading />}
      </div>
    )
  }
}

export default translate()(withBreakpoints()(MyApplications))
