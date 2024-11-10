

# for i in {1}
# do
#   curl -X POST http://localhost:3000/donors \
#        -H "Content-Type: application/json" \
#        -d '{
#              "name": "Donor '"$i"'",
#              "email": "donor'"$i"'@test.com",
#              "phone": "1234567890",
#              "city": "North York"
#            }'
#   curl -X POST http://localhost:3000/events \
#        -H "Content-Type: application/json" \
#        -d '{
#              "name": "Event '"$i"'",
#              "date": "2025-09-27T18:00:00.000Z",
#              "addressLine1": "test address '"$i"'",
#              "city": "test city",
#              "donorsList": ["1", "5", "6"]
#            }'
#   echo "\nEvent $i added"
# done

curl -s -X GET http://localhost:3000/events | jq

# curl -s -X GET http://localhost:3000/events/12 | jq

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