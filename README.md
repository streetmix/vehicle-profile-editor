# Vehicle profile editor

A proof-of-concept developed jointly by the New Urban Mobility Alliance (NUMO) and Streetmix. This profile editor is simplified version of a guidance framework for policies for new vehicles and services.

## Attributes

The basis of the framework uses **vehicle attributes**. Attributes are measurable descriptors for any form of vehicle or transportation. The NUMO framework visualizes five main attributes (although many more can exist): weight, speed, footprint (space occupied), emissions, and health (in terms of metabolic activity). This tool is designed to account for any number of attributes, in case policymakers require some flexibility.

We also separate attributes into two types: **independent** and **dependent** variables.

**Dependent** variable attributes will be mapped, by thresholds, to a 4-point scale, calculated by a set equation. Dependent variables may use other constant values and independent variables (but not other dependent variables) to determine its rating. Attributes must be specifically set to be a dependent variable to be visualized in the radar chart.

**Independent** variable attributes are values that dependent variables require to be calculated. They are not measured and mapped to the radar chart. An example of an independent variable is the vehicle's _maximum capacity_. Some dependent variables, such as the vehicle's _total space occupied_ will be calculated on a per-passenger basis. While _space occupied_ will be visualized, _maximum capacity_ was factored into the calculation and will not be visualized.

### Data structure for attributes

```js
[
  {
    "id": "weight", // identifier used in code
    "name": "Weight", // display name
    "type": "DEPENDENT", // whether it is a DEPENDENT or INDEPENDENT variable
    "description": "Please write the weight of the vehicle when empty. The heavier a vehicle, the greater risk it may pose when in movement. We will add a weight of one driver as 80 kg (160 lb) for our calculations.", // description in help text
    "definedUnits": "WEIGHT", // (optional) whether this uses predefined unit types
    "defaultUnit": "kg", // default (preferred) unit for this attribute
    "exampleValue": 1500, // sample value for UI
    "calc": "x + 80", // (optional) calculation of this value (see section below)
    "thresholds": [[0, 100], [100, 500], [500, 4000], [4000]] // values mapped to a 4-point scale
  },
  // for more than one attribute, put each attribute object in an array
  ...
]
```

### Calculations

Calculations are equations evaluated by `mathjs` to determine a final value, given an input value. This is used to do any processing to the value before mapping it to a threshold. For instance, the _weight_ attribute only asks for the weight of the vehicle, but the threshold calculation actually applies the average weight of a human driver, resulting in the equation of `x + 80`.

The `x` is always used to mean the input value. If `calc` is not provided, the input value is unchanged (as if the equation was simply `x`).

Calculations can refer to other independent variables. You can use an attribute's `id` as a placeholder. For instance, the _footprint_ (space occupied) attribute is calculated as a per-person area. A vehicle whose footprint is 10 m² with a _capacity_ of 5 has the equation `x / capacity`, resulting in a final calculated value of 2 m². This is then mapped to a threshold.

#### Divide-by-zero issues

If any variable does not have a value, the calculation will substitute it with a zero to avoid errors. After substituting all the variables, if the calculation evaluates to having a zero in a divisor, we'll be in a divide-by-zero situation. `mathjs` will not throw an error in this case. If the calculation is any number divided by zero, `mathjs` returns `Infinity`. However, if the calculation evaluates to zero divided by zero, `mathjs` returns `NaN` ("Not a number".)

In NUMO's attributes, two dependent variables (_emissions_ and _space occupied_) are divided evenly between occupants, based on the vehicle's _capacity_ value. It can be possible for a vehicle's capacity to be zero, in which case the emissions and space occupied values become infinity, which results in being mapped to the highest possible threshold. This would be inaccurate, as one would expect the emissions and space occupied to be treated as-is (that is, not divided).

On the flip side, it is also possible for the _emissions_ to be zero. In a zero-divided-by-zero situation, where the result is not a number, this cannot be mapped to a threshold. In our visualization, this is mapped to a threshold level of zero. Since zero is not a valid number for the visualization, its result tells us that something went wrong during the level mapping calculation.

There may be different possible solutions to this problem, but for now, calculations for attributes that can result in a divide-by-zero situation should include a conditional expression that passes through the expected value should any independent value be equal to zero.

### Thresholds

Thresholds are an array of minimum and maximum values that define ranges, mapping calculated attribute values to levels. The NUMO framework has a maximum of four levels, but theoretically an attribute's defined thresholds can be any number.

### Predefined unit types

These allow for unit conversion.

- **Scalar**: This is a value without a unit. (For instance: number of passengers)
- **Weight**
- **Speed**
- **Area**

## Profiles

This section describes the data used to give each vehicle a profile.

### Data structure for profiles

```js
[
  {
    "id": "vehicle_y5jmygphz", // unique ID - can be any string, there is no format requirement
    "name": "Bicycle", // Display name of vehicle
    // Object of all attributes corresponding to attributes defined above
    // Each attribute stores a number value and units, in text
    // It's possible to not have units data (in which case it uses
    // the attribute's default unit) but specifying the unit is always preferred.
    // You can attach any amount of attributes, even those that are not
    // being used by the attribute definitions for measurement
    "attributes": {
      "capacity": {
        "value": 1
      },
      "weight": {
        "value": 10,
        "units": "kg"
      },
      "speed": {
        "value": 24,
        "units": "km/h"
      },
      "footprint": {
        "value": 0.789,
        "units": "m²"
      },
      "emissions": {
        "value": 0
      },
      "health": {
        "value": 6.44
      }
    }
  },
  // for more than one profile, put each profile object in an array
  ...
]
```

Profiles can store other arbitrary data, since they're just JavaScript objects. For instance, for our case we have an `image` property value so that we can also store a URL to an image for the editor UI.

## Embedding into another site

You can use an `<iframe>`:

```html
<iframe
  src="https://vehicle-profile-editor.netlify.app"
  frameborder="0"
  width="100%"
  height="100%"
></iframe>
```

This code can be edited make the embedded tool any size you wish.
