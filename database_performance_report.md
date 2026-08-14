# Database Performance Report


### Most Complex Query
```EXPLAIN SELECT * FROM rets_property WHERE LOWER(TRIM(L_City)) = Lower(TRIM("Alameda")) AND L_Zip = 94501 AND L_SystemPrice >= 100000 AND L_SystemPrice <= 3000000 AND L_Keyword2 >= 1 AND LM_Dec_3 >= 1 ORDER BY L_SystemPrice ASC LIMIT 20 OFFSET 10;```

### Result of the Explain Query
![+----+-------------+---------------+------------+-------+------------------------------------------------+-------+---------+------+-------+----------+------------------------------------+
| id | select_type | table         | partitions | type  | possible_keys                                  | key   | key_len | ref  | rows  | filtered | Extra                              |
+----+-------------+---------------+------------+-------+------------------------------------------------+-------+---------+------+-------+----------+------------------------------------+
|  1 | SIMPLE      | rets_property | NULL       | range | idx_L_Zip,zip_code,price,beds,baths,beds_baths | price | 5       | NULL | 17601 |     2.50 | Using index condition; Using where |
+----+-------------+---------------+------------+-------+------------------------------------------------+-------+---------+------+-------+----------+------------------------------------+](./misc/image.png)

### Observations
1) Out of the 17601 rows scanned by the database, only 63 of them ended up matching the provided parameters
    - This means that this query led to ~33% of the total properties getting scanned when only ~0.12% of properties actually matched the parameters given.
    - Indicates that the current indicies are not optimal in narrowing down possibilities.
    - Scan Ratio: ~275
2) The key used for this query was price, indicating that the keys for L_City and L_Zip were not suitable for this query.
    - Zip Code and/or City would have been better indexes to use in this situation, as they would have reduced the number of rows more than price did.
3) The type of the query was range, which caused more entries to be scanned than required, especially since we had reference parameters such as L_Zip and L_City.

### Key Issues
1) Formatting the name of the city leads to the database being unable to use L_City as a valid index, slowing down search times
     - Running this alternate version of the query ```EXPLAIN SELECT * FROM rets_property WHERE L_City = "Alameda" AND L_Zip = 94501 AND L_SystemPrice >= 100000 AND L_SystemPrice <= 3000000 AND L_Keyword2 >= 1 AND LM_Dec_3 >= 1 ORDER BY L_Syst emPrice ASC;``` resulted in the following result 

     ![alt text](./misc/image_1.png)
     - In this alternate query, by not using ```LOWER()``` and ```TRIM()```, the database is able to use the existing city_price key and scan only 208 rows, which are about 0.39% of the entries. 
     - Scan Ratio: 3.25, a ~98% decrease compared to the previous query.
2) A lack of composite indices that filter by zip_code as well as duplicate indices that clutter the database
    - The database lacks composite indices on zipcode, including just one non-composite index.
    - Furthermore, the database has a lot of redundant indices that can be removed.
    ![alt text](./misc/image_2.png)
    *A list of current indices*

### Proposed Changes
1) Remove ```LOWER()``` and ```TRIM()``` and use alternatives to make indices work with L_City.
2) Delete redundant indices and add more composite indices for zipcode.

### Measuring Improvement
| Change | Query | Time Taken Before Change | Time Taken After Change | Improvement
| :---: | :---: | :---: | :---: | :---: |
Implemented text cleaning in Javascript to eliminate the use of ```LOWER()``` and ```TRIM()``` and lowercased and trimmed all city names in the rets_property database| ``` SELECT * FROM rets_property WHERE L_City = "alameda" AND L_Zip = 94501 AND L_SystemPrice >= 100000 AND L_SystemPrice <= 3000000 AND L_Keyword2 >= 1 AND LM_Dec_3 >= 1 ORDER BY L_SystemPrice ASC;``` | 21.024 seconds | 0.182 seconds | ~99.1%
Re-do indices for database, focusing on common combinations to minimize query time | ``` SELECT * FROM rets_property WHERE L_City = "Alameda" AND L_Zip = 94501 AND L_SystemPrice >= 100000 AND L_SystemPrice <= 3000000 AND L_Keyword2 >= 1 AND LM_Dec_3 >= 1 ORDER BY L_SystemPrice ASC;``` | 0.182 seconds | 0.082 seconds | ~54.9%
Converting ZipCode Input into a String to activate Indices | ```SELECT * FROM rets_property WHERE L_Zip = "94501" AND L_SystemPrice >= 100000 AND L_SystemPrice <= 3000000 AND L_Keyword2 >= 1 AND LM_Dec_3 >= 1 ORDER BY L_SystemPrice ASC;```| 20.086 seconds| 0.0402 seconds| ~99.80% | 

### Conclusion 

![alt text](./misc/image_4.png)
*A list of current indexes*

There were a lot of redundant indices and issues with how the database was being queried that were slowing down reponse time and bottlenecking the system. This is partly why the app was slow in displaying results. With these changes, the query response time should significantly decrease, making for a better experience. 

On average the response time decreased by ~99.3% with these modifications, suggesting a significant increase in lookup efficiency and the reduction of bottlenecks.


