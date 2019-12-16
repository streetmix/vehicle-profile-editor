const GSHEET_URL =
  'https://lwh6oxm5db.execute-api.us-east-1.amazonaws.com/dev/vehicles'

export async function fetchData () {
  const result = await fetch(GSHEET_URL).catch(err => {
    if (err) {
      console.error(
        'Error while retrieving vehicle profile data from Google Sheets:',
        err
      )
    }

    throw new Error(err)
  })

  if (!result) return

  const myJson = await result.json()
  const vehicles = myJson.map(mapToVehicleProfile)

  return vehicles
}

export async function saveData (method, data) {
  if (!data) {
    throw new Error('No data to save')
  }

  const vehicle = {
    // These values are validated in this manner on the API
    // so they can't easily be updated to match the profile definition
    key: data.id,
    text: data.name,
    value: data.name // This property is deprecated but still required by the save-api
  }

  const meta = ['id', 'app:edited', 'save', 'del', '_xml']

  Object.keys(data.attributes).forEach(attribute => {
    if (meta.includes(attribute)) return
    vehicle[`attr${attribute}`] = data.attributes[attribute].value
    vehicle[`units${attribute}`] = data.attributes[attribute].units || ''
  })

  return fetch(GSHEET_URL, {
    method,
    body: JSON.stringify({ vehicle })
  }).catch(err => {
    if (err) {
      console.error('Error while saving vehicle data to Google Sheets:', err)
    }

    throw new Error(err)
  })
}

function mapToVehicleProfile (row) {
  // Grab every column beginning with the string `attr`
  // To add new attributes, just make a new column in the spreadsheet.
  // The spreadsheet uses column names beginning with `attr_`, but
  // the sheets API conversion process strips out the underscore.
  const ids = Object.keys(row).filter(key => key.startsWith('attr'))

  // For each corresponding attribute id, find the units column (if present)
  // and build an attribute value object
  const attributes = ids.reduce((obj, id) => {
    const name = id.replace(/^attr/, '')
    obj[name] = {
      value: row[id],
      units: row['units' + name] || null
    }
    return obj
  }, {})

  // Return all the attributes, including other properties in the row
  return {
    ...row,
    // if row doesn't have an ID, use the text as key value
    id: row.key || row.text,
    name: row.text,
    attributes
  }
}
