ChangeLog - 30/3/2025 - Claudiu

* Am modificat Bug Id sa fie BIGSERIAL (auto - increment) in BD si in Java, nu mai este necesar sa adaugam id manual.
* Am schimbat in BD BIGINT in loc de INT pentru foreign-key-urile catre ID-urile care se incrementeaza.
* Logica a fost mutata din Controller in Service; Controller se ocupa acum strict doar de apelulurile catre servicii.
* Parola va fi criptata acum cu BCrypt, algoritm safe. -> A fost creat un nou GET care returneaza boolean in cazul in care username-ul
si parola se potrivesc.