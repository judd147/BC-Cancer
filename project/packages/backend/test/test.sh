# for i in {1..10}
# do
#   curl -X POST http://localhost:3000/events \
#        -H "Content-Type: application/json" \
#        -d '{
#              "name": "Event '"$i"'",
#              "date": "2025-09-27T18:00:00.000Z",
#              "addressLine1": "test address '"$i"'",
#              "city": "test city"
#            }'
#   echo "\nEvent $i added"
# done

# curl -X GET http://localhost:3000/events

# curl -X GET http://localhost:3000/events/6

# curl -X PATCH http://localhost:3000/events/6 \
#       -H "Content-Type: application/json" \
#       -d '{
#             "addressLine2": "test address 666",
#             "city": "test city 666"
#           }'

# curl -X DELETE http://localhost:3000/events/6

# curl -X GET http://localhost:3000/events/6

# curl -X GET http://localhost:3000/donors | jq

# curl -X GET http://localhost:3000/donors?city=North | jq