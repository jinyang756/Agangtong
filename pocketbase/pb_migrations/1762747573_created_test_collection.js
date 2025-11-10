/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "sijmdjmab58m957",
    "created": "2025-11-10 04:06:13.751Z",
    "updated": "2025-11-10 04:06:13.751Z",
    "name": "test_collection",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "qsn3x5x5",
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
  const collection = dao.findCollectionByNameOrId("sijmdjmab58m957");

  return dao.deleteCollection(collection);
})
