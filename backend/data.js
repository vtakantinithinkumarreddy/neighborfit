// backend/data.js
const { ObjectId } = require('mongodb');

module.exports = [
  {
    _id: new ObjectId("65f1a1a1a1a1a1a1a1a1a1a1"),
    name: "Downtown Core",
    crimeRate: 2.5, // Lower is better
    amenities: 9.2, // Higher is better (0-10 scale)
    priceIndex: 8.7, // Higher is more expensive
    transitScore: 8.5, // Higher is better
    neighborIds: [
      new ObjectId("65f1a1a1a1a1a1a1a1a1a1a2"),
      new ObjectId("65f1a1a1a1a1a1a1a1a1a1a3")
    ]
  },
  {
    _id: new ObjectId("65f1a1a1a1a1a1a1a1a1a1a2"),
    name: "Riverside District",
    crimeRate: 3.1,
    amenities: 7.8,
    priceIndex: 7.2,
    transitScore: 7.0,
    neighborIds: [
      new ObjectId("65f1a1a1a1a1a1a1a1a1a1a1"),
      new ObjectId("65f1a1a1a1a1a1a1a1a1a1a4")
    ]
  },
  {
    _id: new ObjectId("65f1a1a1a1a1a1a1a1a1a1a3"),
    name: "Uptown Heights",
    crimeRate: 1.8,
    amenities: 8.9,
    priceIndex: 9.5,
    transitScore: 6.8,
    neighborIds: [
      new ObjectId("65f1a1a1a1a1a1a1a1a1a1a1"),
      new ObjectId("65f1a1a1a1a1a1a1a1a1a1a5")
    ]
  },
  {
    _id: new ObjectId("65f1a1a1a1a1a1a1a1a1a1a4"),
    name: "Green Valley",
    crimeRate: 2.2,
    amenities: 6.5,
    priceIndex: 6.8,
    transitScore: 5.5,
    neighborIds: [
      new ObjectId("65f1a1a1a1a1a1a1a1a1a1a2")
    ]
  },
  {
    _id: new ObjectId("65f1a1a1a1a1a1a1a1a1a1a5"),
    name: "Ocean View",
    crimeRate: 3.5,
    amenities: 8.0,
    priceIndex: 9.2,
    transitScore: 7.2,
    neighborIds: [
      new ObjectId("65f1a1a1a1a1a1a1a1a1a1a3")
    ]
  }
];