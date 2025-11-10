/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "sygp5djj4qijhl4",
    "created": "2025-11-10 04:06:24.092Z",
    "updated": "2025-11-10 04:06:24.092Z",
    "name": "test_collection_2",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "3gitz2q0",
        "name": "test_field",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("sygp5djj4qijhl4");

  return dao.deleteCollection(collection);
})
