PGDMP     1                    z        
   tempviewdb     11.14 (Raspbian 11.14-0+deb10u1)     11.14 (Raspbian 11.14-0+deb10u1)     |           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            }           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            ~           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false                       1262    16384 
   tempviewdb    DATABASE     |   CREATE DATABASE tempviewdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'fi_FI.UTF-8' LC_CTYPE = 'fi_FI.UTF-8';
    DROP DATABASE tempviewdb;
             postgres    false            �           0    0    DATABASE tempviewdb    ACL     2   GRANT ALL ON DATABASE tempviewdb TO tempviewuser;
                  postgres    false    2943            �            1259    16404    measurements    TABLE     �   CREATE TABLE public.measurements (
    id integer NOT NULL,
    value numeric NOT NULL,
    "timestamp" integer NOT NULL,
    sensor_id integer NOT NULL
);
     DROP TABLE public.measurements;
       public         tempviewuser    false            �            1259    16402    measurements_id_seq    SEQUENCE     �   CREATE SEQUENCE public.measurements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.measurements_id_seq;
       public       tempviewuser    false    200            �           0    0    measurements_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.measurements_id_seq OWNED BY public.measurements.id;
            public       tempviewuser    false    199            �            1259    16386 
   migrations    TABLE     M   CREATE TABLE public.migrations (
    name character varying(255) NOT NULL
);
    DROP TABLE public.migrations;
       public         tempviewuser    false            �            1259    16393    sensors    TABLE     �   CREATE TABLE public.sensors (
    id integer NOT NULL,
    sensor_name text,
    sensor_fullname text NOT NULL,
    sensor_unit text NOT NULL
);
    DROP TABLE public.sensors;
       public         tempviewuser    false            �            1259    16391    sensors_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sensors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.sensors_id_seq;
       public       tempviewuser    false    198            �           0    0    sensors_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.sensors_id_seq OWNED BY public.sensors.id;
            public       tempviewuser    false    197            �            1259    16420    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    admin boolean
);
    DROP TABLE public.users;
       public         tempviewuser    false            �            1259    16418    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public       tempviewuser    false    202            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
            public       tempviewuser    false    201            �
           2604    16407    measurements id    DEFAULT     r   ALTER TABLE ONLY public.measurements ALTER COLUMN id SET DEFAULT nextval('public.measurements_id_seq'::regclass);
 >   ALTER TABLE public.measurements ALTER COLUMN id DROP DEFAULT;
       public       tempviewuser    false    200    199    200            �
           2604    16396 
   sensors id    DEFAULT     h   ALTER TABLE ONLY public.sensors ALTER COLUMN id SET DEFAULT nextval('public.sensors_id_seq'::regclass);
 9   ALTER TABLE public.sensors ALTER COLUMN id DROP DEFAULT;
       public       tempviewuser    false    197    198    198            �
           2604    16423    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public       tempviewuser    false    202    201    202            w          0    16404    measurements 
   TABLE DATA               I   COPY public.measurements (id, value, "timestamp", sensor_id) FROM stdin;
    public       tempviewuser    false    200           s          0    16386 
   migrations 
   TABLE DATA               *   COPY public.migrations (name) FROM stdin;
    public       tempviewuser    false    196   �n       u          0    16393    sensors 
   TABLE DATA               P   COPY public.sensors (id, sensor_name, sensor_fullname, sensor_unit) FROM stdin;
    public       tempviewuser    false    198   o       y          0    16420    users 
   TABLE DATA               C   COPY public.users (id, username, password_hash, admin) FROM stdin;
    public       tempviewuser    false    202   �o       �           0    0    measurements_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.measurements_id_seq', 3062, true);
            public       tempviewuser    false    199            �           0    0    sensors_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.sensors_id_seq', 8, true);
            public       tempviewuser    false    197            �           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 1, false);
            public       tempviewuser    false    201            �
           2606    16412    measurements measurements_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.measurements
    ADD CONSTRAINT measurements_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.measurements DROP CONSTRAINT measurements_pkey;
       public         tempviewuser    false    200            �
           2606    16390    migrations migrations_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (name);
 D   ALTER TABLE ONLY public.migrations DROP CONSTRAINT migrations_pkey;
       public         tempviewuser    false    196            �
           2606    16401    sensors sensors_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.sensors
    ADD CONSTRAINT sensors_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.sensors DROP CONSTRAINT sensors_pkey;
       public         tempviewuser    false    198            �
           2606    16428    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public         tempviewuser    false    202            �
           2606    16430    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public         tempviewuser    false    202            �
           2606    16413 (   measurements measurements_sensor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.measurements
    ADD CONSTRAINT measurements_sensor_id_fkey FOREIGN KEY (sensor_id) REFERENCES public.sensors(id);
 R   ALTER TABLE ONLY public.measurements DROP CONSTRAINT measurements_sensor_id_fkey;
       public       tempviewuser    false    198    200    2802            w      x�U]i�e���]�\΍esy��#i4w�i�(D���RLۿ��k{�o~���?I����7~$b��$�� Y�Z��a����~%���Ϭ����7�wB��J����D�"m.���U�9Q��6��KvB��,k��ٰ�R�=7��go7��go�&e��Z�N���D�4!�1BOIo��в���z��C֩���AeW�kM8S�#ھ��	m�(v4r?T�Y!*{�����U�1>je	OF���G���c�,|���f�ʮ�w��o���i���i�����^�Gq��LB�黣�fc��ov�79���C[�����zmf�b|e���V��J��z�����)۽����~/g/����Jﴐu*�Pv��*�	�i��WF�����Rk�^��h��Uh�"TV���~��|�4�mq�䄤���>&ۚ�Z�zVM��4٤��c������l��6YF+#=�Vɦ�n[L���Ȃ��+��D!9��6�`̳8��SC��]��
٠�K>�ӱ�\�T�g����tC����>���߭� �zb�j��S���?��|�W������ݖ�q�e���P��u�w������/gB�^I��-e&�������W�j[!���O#
Ųg�7��p�0\�F��*����ߍWGx��]�pH'��M�X��xJNZ@&̟��t�P�j��@QK�NZ8ل�Ý�[W�ؼ�5S|RM�iUtVJ8����dU�n�	�jN9i`���77p�Zm���H�/���,�8��?(^i��K[Ki����J�ɝ���AIJ{�d�~�u�m(��~�&MGm����l�OBŭ����)�t�F��z��I�'��_��φ~R5D��Hˬ�!�f�"�!؛Ϧ{S%MWm&#���a���3�7�M��zRa�/�]Hmb������m�g�tvx`+�6�t�=ۛ�f��jXF�����_��O��q��*0C��P���T�@�e]���w��t��l,��C���������,na�g�L�&0X�s-oB[�WӦI�U[�7��ZY��ð7�-Hu���0`�Ii#�F&_�vV=����I�pXBA�0�XU�	�~��ٱ�Pq�p	��fo/Ga�fzNm���˿+,f�K�٣mFa���Aڙބ{���b��g���M����ڗ�>b�m����khJ�L���&�I��V3�3 �t*���&<��B&=�:�$f��H���Dkx��&P�j*��[U��R��m����K�����(�+:|�<�m����SS�a��_�eľ�,>��҄�t���P�Y|����MaMMMs��Lc�_�->�ŕ�7�k4�,�6!o�W�	�"�w�l6kڲ�5-�gs�K��Mxl�Fq���ű�{�6��"w�j���X��'DE�C������7�+ٯ�mδ�������� �zW�.��ۏ��[��f̋�r�i����5Gjxn{�ǟ\|e�Ma��u6FP��XL�\ю�:;�%���8������R�����~�Q/�	gVtXs�&>\�	�"�߇&<Q�O��
�����H��N���P�1?`c�=���X\|d퇋'���2�0}��fbi~lB쎴�il�Ē���
��O��� N�h%��"�+Q7k&�&;�B��\<F0��&���
c3D�f�`ݿ�0*�����Ң�	}���|5`��L4���ފ���т0�ލ�	�}W�c'�� =�l�޺;0&����>	�}�p�h�[�����M��L��Y��S��"��n���s��ԃ۷���y�?&L���|Y���$~v�
�2"棯pL��7�p�Y>��+��.�m�Yxp��pk�F�Bn�x%춶�*|��(q#�z�e�uE%�g���z��K��.�-��Km�Ƭks���Sr���(,L��mmy��}�>�j	gjv�ܩ9Yx���S������4�z����6��`�G�x��8��l=�7�a����o1N�47���5wj.����v͊�,.k�7�6F�/2}��]"�MĮ�@���l1���M��e��\��W�\�dqv�Kj��#p4:���Ac�	��h\<�4�SB�U6�s��X\<�5��G�k���dqy����i4�3&7�˩�٣�&�{&���}EYxR58���t�9�jN�X�z-&�&���������4�V|q���m"�լDњ�g�Jףy�>Գ�MլD���:��:0^��u�1f%�6�1;���ʹA{��Dq�#�NX��y�?���c�����@��V�6�Dߚan��a���bB����՞oa���I��D9OϢ��p:�|���Ϟ�,,�p"��O��H%��K�H�J4*�A˧q�4	v >�ˢ$���ZrH��֒�y+c�fv[r@��$j|�����֚��'�yJK@[�������H6wVw�4HZw�ki�F�*��16�﹬�-�T�����T8&>�T�0N��~g���Ro?��z��]_��ц�?~Z0y�\_�h����a�u֋�����ԛ�� �l�r���&�[%^���LW�p��;4saM�v�jۏ3f�}���/{Kdв����������4�p�����i�[}dq�⁜���L�Κ'5W���>S���G1���M�����Ώ��8o�_�g���#A5��GΉM�&�1�xbh֌�hNn��(�O�!*���ٓ/���
q\�w[nM|fXOn����iq�D�b�g"nq�g����r͓�O$-Z^٧nj�\��E��������G�E���5"��ί���v_	����^6c���5��;q��4wM�c�đM��E��"���>8v|��t���z��ae N���m6k�'�|���։9��
�Đt֜�9X31$�BTD�в9�G-�9��cc4l��'���dE.	,�6�����B$Q��2�8;/�!�\QbH�R��!*:��=��:Ѥ<#��n��4z5p��4 ����2>���~^a����,<��L�Y>�Vݺ���g�&�Y���(�T��dy��囻���U�)�V�~��|�=%����T�^6'k��\��Rs��C�ڹ����]�	�t5e����)]����6�fk�٩�L_Z�֚G,�sHm�M�ʹ��%��{@O�e�I��p�I��mLe7�����Q����*����U��+��d�������6k��+0��?k�����G��o�&ה���G�NǪ������=:;�� �Rn˯�!�Ģ�������y?7���r�����e<Y�����o�l�q�M�l3N�l�d�	Pl�H����M*<����Y�
&����飉��r6����&h�sW��S�L,��&���s�"OS<bퟐ��CZ	���G)���>�m����V�v�ysg���4�H<�J$���������J$��v���L���i-��;���a>��B�j�-k�v�����w��
��
������%K:Op
�;�)����oJW������G�:��D�v�I|�1��잧�xͰO�S9�3ær���r����k��I�	�4}П���!ٰFiJOG�w$#5���L���)ޖ�966��� (~wds�MLW��I�ͩ��1)~����4a?i�<�����tⱵeq��Gq�Ⱦ�ӻæO�\��o.��"�.y�s�I�8ۄ�H�����u��$k�>:y�����Zj�;��}�,n^3�O&����	�j��oO����v�\�d�u�V]��!��ē�v�	I�&�Ծ�����	@dp@-F�=8������ܝ18Fl�#�1�dBv,6���5c�f�Ú�D[1�(*��������pz|������韎�z�}r��X�n��?=!���O�$O(�%�<\<q8�WdcZj�G���i�z�fD��s��y?po�/�_M�9j{qHy���4f�t?J�����8��x區3N��a��\<6u��o#� ����,)2�,�M�{'O5l���΍|�����iz=sz���Rvl� 8sGH[��(7����<�)XX�QHV�� �Cʣ�}8���(mל<��g��J�M�gR�>��r��t�}�m�@y8$�    ��&�)��gs����~�B4��<�s}��yC��D�p�D���=p+ǋo.������a�Ģ(WT)�?�3����0}D�m��cs{�6ñ��kR �m�sFj�{!���.�C�rH'�����*���|��\���~���ϻ�Π4���qH ���lJO����٩&�dfaHV֗�!��&*DY�X�Ѥ��ƨ�l2�������R-ڣ�X�-51|�'��ht�y��ŷ�!�H��δ���G����C���G����W��}��8������}Y���m.�����R�,E�"y�<��tɤ8��;t�̄�3��=�~��wp��w��	%ߓ#��E��N&bm�J�͜A���'V�sdl����g����HZ���O�UOJ|R�-���N�{���< ��9�wϔ�',�|���'���/dr }����I>2���Y��a��޸w�\��(W?z�6����z��/-�nV��	7���d5�gq(y�s�e$jw{����;��\O��wx�'��F�y�[�헼BTBS)5'�p|���k��B�L���5�=�9�/'��{�2W�Q2u͟3���(�����������{�ʾ(��{>,�ei�W�\萐��#�{�o�<{9@�,6Y3��xE�sb]/Ȋ����e%:q��Vf�{J��n��_���%'.v�ɝ�T�v��e����_2�d��ʞ�G�C�+:T_(;��?}�#���>���Nx*��?!���C�Ǟ��rs¹n�G?��J�y��0*��e�_5�	�`|Lʡ`��P���z��DV���F�)����E�����A��U�� �[��*����x�����m.}��ͤ�%�_�&\X}�F9Y&�����l8ё��9�~bh���W��\zgiG<�9��4gk����N�ײ8d�(>�릍�H����+��2:�E���W�tKR��X\>&U��K�'�i��h�I����wե^����=Z����t���3��5P��Z⍮��0�5k&�&_܁���Ο�bz�I7HY^��iC��"�i�-HY�K'�VWl]��2�5H�~�@%Pi_it��D�_�}�4��±ܓ�O�s���R�h�6,J�R�����B��X�SבPܓ5�{�}+H��M�1�_9�_׼�!�C��M]�	s�Pz��X
��.����٥�����56�s���Y��Ss�fB1n��'���O(~�@�d��'�ĬpH+f]l~��CX��AD8�ј"�x�V���B�l.�#�.�����r9	��}	]���$*�����R�[;����ڂ��d���;�����gV���z�]s�F������/�������t<�s-��.2B��'�}��\��MƤ��$x�3M���T���k5*�ӥ�H�{�H�'��D����"�l0p��n;�d���΍J@P�b͑����wi�t�=d�U�L�[�&�I��B��U�9$�M1r�A���B��S�x�9������Ҟ�7<�Rd����%x��,O�UW���E�Ҡa��Q�K@�*�j���X�x����K�y����ַ�	�c?�\>�)R$��6�pU���C��>��jW3�1p��4Oj�w+إ�B�	���_��F*��F�n�����C��C����ˏ,��TK��	c���A����)�Pk����39�'����t�����ƂrFyBo��A��U)k�$oc1���1�P��wgO{��6�8ݓ�K�_���<W��c*?�KF��p`��q�^m��Zjt�~a?6��z8��8=�Qy���d�>qz�#�p�W�ϡ��t�PO"��A�*ro��+�(������ß�X�T���~5C���1ѫpP3q깋W3�u�Z~�O�1,3P&�q(�SBZ~:jjz��[�������+q�)�U�J�jg̈́��i	����U�~��[6��?��PD��J��P��� �ځS���x��I�}V����ؾ�Y&��ҝ��ޞ:N6q��ϸ�����s��Տ�}?��Ψ���aOq,ݼ�
������hEFY�i���/.��僦I�x���}�Z�e��K�&��MXWKW���B5�Q�>Ҿ�Ȱ��Q�:�'=�%��;���|���v1w��2�k�����P����:'R�|��367|����A+v'�R��P0>�!�#b̷P��>spZ��Ml	@8D R� @����v�R�'�銼Ic�	�E��&�Ꮩ4;i��R���ߒ�
ē>�]�Rs�V��-8�׶�;�����T�-�wW���0���pq�[qp-V�`_z���Ń[\+��f����C����B��oo�������؉��ߜ�7C�����k�c��K>{�ǽ {$����F�w�Da�/^ݝ?�I�[/����޹8�;�șw�l��P�T����	"�px��}��Lp�B�9�[�<º̣�+����v�=~���D�UhLiN���P/�N�6���5]�踽�v7���宛5��ܳ�fm�y���'��]��,�*�����z�BV�U��E�ǺN3�)�r�r��[�Ke\� ��q9j�t<���+�޸��C�p��7�����$ݼ1��ד�J7�0�£vti������:{�x������ݻsh��Ci��؎ܐ�{��[F��=�5��hy�D´���^��ug��*�0���X��@G*Rp
b����Z�:������VƵp���=w�躴ky�d[7g� �6�y��'N�W88�J{p��K�ib|l"1�'���M/�4]�G7�~��N�f��E��>Kq�����j��)���W0��'Ó�x�˘����~�.�i�&P�9Η�i�6����|:vG"�){���?�lO�h�߭i�efw|$����_�m5v� �:�&Y1���6�p`�#�}��m�"Oڒ��$׵��j�8\��=Zk����-�-XP�`a����3�f؝���Ťڢ��oh�	k�qw�;�'Ml2�s�
b>�-�Go��n�B�Ͱ��ea�p`}���MZ���+�;^�Ğ���{�ƤI<��#�ui~��Y�~�c���.��(Hbh�����8�K�>�j���O��a����*��gů^3ڲL,�c�~r��+��?�|}4[b�5ד�U%��H���j��K���uw]�9��W���Uw�J�<���.�d�r��B�2$�Vm���
����W���}��4��;��BB��J�bt��{�'铉j�7ل�OD�b[į ��m��g?�i���v+�^ʰIsH�p{�H 
@�b�=r������Ȇl�+ѱ��ӽ1 7�D��MAl)���KǬ	� ~Z���F+��Ϳ�/JN����dґN�Lg��x��Y&^f�Is���O^PBD��8�,��K���'9�wz 7!%���Z��5P�y����)��|��?n�I{pt����{����`J��o�^���oW'�v��hy�6m�'�ɢo1�vO򸝡�S�(�I{�lbf��퉻�����8h�4}����������\A�~Pnt*�K=7�/[rqϙx��K���Oq��P
T����r�9Т�li�՘�+�R�Is	kc�I��	n��Xj|�·-M�UW^?�iF�)g�C���.F��N��&�e�R�L�,j��P9ZؚN��G+ ��Iqܭ�zEń�T�U%{s+ǀ�=�WF� �����dxe�����lb���dKT�ၧ�;��Ң;SS�P/���.8F/��X�Ox����Ǒn0�\�b|2�U!�^� 8�5�I�;� ���w�Ĥ��p��g)�+s&�	��>���^��AJ3�5<cS�{vO֦����� ;b���x�"�'�61����p�1��M�΋�1����O���ܘ5�O�M\I> ���Q F�*���B�L�h�->�[{�EMj�
z���錼 Ղ]�*�d���c���Ǧxuq���ض����VV��    L���i�bkφ�� �kN�X2�H�lQ��V>l�]O�f��o3�ؓ�@��cc��;��ǵr�aK�&ϏO1㓦w�{o?qZ��۹� �FR>q��Gc)��\����ӝB,?6FU����5���'�rn����ӄ�V�r~�$m�9�h<.5�����[?�˾^�v�?��2<a��&G#���k#7x��X�	x9 ��~hg��Br�<|�r͞X��籵'���/��T��MN���S�������A[���G2��Ls�Փ`c1@�B���x��4�:��rp��Repj�ɸ�S?���Q�Ohꉀ͟��K����v�ߕ�x�}�#��Z�%N�v?u�7�¦�e~�b[�\����H6���|�0��lF�b�Qa�o��!_	���Ǯ�]a�j�F�I�|ua�R|��vI8�)Y�P5YG۔�>��>��W;X(Z�J꓆g=�5�m�5F�V�"����Pߵ���'��g�e�<�wM1{Pr�r���l�c�X�G/��0�1�b7�<çӀ9{ŶV��`PPޅ��&�倫��M4pP^=�J�$��σ����u���yJVCm0e�+���r���d����®�Oa��r��2�܂�g�SpU���bq ��q�q��u�_��,Y��\ �,���x~%o���եIˁX����`��5�ӵ!~���ͳ<���{�����oMB�ȅ��E���	�l?�-���B9$.�臨r|�J�"X�۷!;(�ħEq�*0i�m`��F�˒�zps��������݇�`��:R����x�D��xk����W����=6Pa��S�~��ϟ#���Ypa�7�l|�B�n�B�u���]3Pdް��8²@�]ę���W>��������<��7�6B�+�;,����vN��?.H���%_�̻2PO ���#=�yX$�"]��4���x�/j��Jfxá�q���ǫ���.X|ܭ��-/�v�R�����������&�s��e��X^�������(U�n�Z�\/4\��7T��VX<��#9�ݕ1����o�Ş��x��c��>h�uu��W�ۼ?Z	{߬:K��!u}�]7�]��N�yeY���dA�<�,F�\M�ҡ���;/?�*��~���Ѯ�l�>ɪ���i�4SƜ��<�3^x�����0ډ@p��{��@K�8�u�­���9"�d]e�>�	Z鯼��o���=�m�s��*Z}�x-�����-�=��n(��wd:���M�v����N��۩�k�:z��!�	J)=hթ�TF�h��	~�q���eVX9�S�E1V� ��q���c6]m��:���k7�
XL�����Li�n�F�����J���i����;b���ׯ��Ͽ}J�OxxH��fg,bVkl6wn��E.�cRy�Qۚ	�`�,T�E10b�@���� -�W^k��ٞx8�r�`c^q٠3�Ugp�>R�2O�\�qm���v�<M���!�nn���6����8���XK���M��������c ɦ�3Ӂ&���e�Y�P�ba�ٵW)?�5HӍ1�D��@��b��4q:�޷Ċyˇ�s�f��t ����i������mrxy�\�0Q���&fg�,RM��`�S��%ݬ�I7��W�Z[�^��t��c�|�|���|Nd������Ӊ���3C�����w�+��/�����ޓ|l4�]��L,V��o���N_�m�XW\6�m�4�ڂ-�LhP�.�I[l��0�,��iyw�QXƻ�wտt�WXCە�{��z�Ox*#F��𮰬Ҿ��{h`��7������.I	���}_�d��~�O�l��:y�m��Ӈ��=���{�w�	�����x�܃����u0qِ����ZcQ���\���3raB){΁+w(��R��ҬO&�(�ϯ�|��7G7�0�攁�H����` �
�M����5��`����9���}���xr�6����`�\;���;�1�6������)�5�ɟ� ߅,����f�O[���>���!��ʅ��J�S~���W�p�w?�)��P�7[��ez����q��"�3�)e����7�<Q�lh�
�[�Ɩ
��=��17�;�3�Z�}��Y� �OX��yy4�lx��CvYx$�}'�`s��������w7���X�^>p6d�쮼*���:��ʎ<W�G�3��o�����I� !�7b�U�BZv^d?7��A�2�fR�{������H�ӻE~�S�.��IW�v]]��<�IG���vű͂Q�L_����ˆw`av������QP�7I�N�������Cp����iʴ�'.7\7��#�֩���a�����J�:螓�'�wV���FgŖ�J���ދ��k�+�.<�����OX&9�O�o�F�IU��Y��gʖ^+�R��:DV)��]�b�����L�c��*��ay)�'���/�9M$k܏?�㭮4�3j+���i+��(8o�%�β��\���9�'R��t�8m�Nw1M�~��s��I��a�����[�t��H�3w�}��81��\7��ȏrA�(ݡ5q�&�(8㨇��-�&W�iz���|\
����x�B.8Kȴ��|Z^��igqlŀ��5ӉT��m�ջ���7b��cc��t���B�r�u��Z5}�	$-P"��l�;�������z>w��;��-;b���kk�<�0��O�7���B��V��?����\~�+������P�<WN���pO�آ*�@~[��09A��N��i,a�ש��'$N?�v�R?�`B�͏ǎ��ڤ}�3v^l!w�@���Z�ޅ7@-/(M�$�asFԇ�����������F�����Jy�8er?��<膌㫃:0����ɍ�ٍʮX�2�����u�jN�6o�xⴁ���
�����
�X��]��
�c��.���\���Vu�-f�0f�:���9<?�Cx��kO�͛�x���/���:�qǰx)Y.����J�K���~�R�������� N�'NJ�kֿ�-����)��;77�A~�� ?=+[/�S�^��}�Y����n�(�֦ݲ!�7GN�KLK��DZs���	��O��rg?��{��B��2Yqh~��ez��ܮ���EΉA"�U���q�{�'�\^�C4�����\gu��Qʓ+�B,2T���1|Pt��|��}t��O���}b�����b�!����h<�<��5J�O'j�\��F�)y'�r%��X+�]y�6K�5�M��������P6]�֏�I�B�I%��W�V:�V���ʭ@�މ���[���P���Ы?!�yBTa�����,-����n�JK���	7N}�Y�����2�J�]��.���8�|ҫ9o���>J�'>d#">���}����9H��j�:b�9j�N�$�U7�H�R�Q�Cg�̢"u�T�����m�����O��GN#��F"]b�rk�q����HH�H�9�+ِ�Ad#��x�����e�R^��l�����:i�����RZ��N'�n�#XěӼ�����[~�al�/���].@dL���4_�2QV�wl|}����g�nہ��m�����;y�&k9���t��0W�@=�;o�:��++���B~��o�9�2��Bv+�<_�.P;�J�g����\��ʝ�M����(@�/�Y���孴&WXP_?0���ő)��)'�%�55j��,e�O���˚k#Go�ò�B��Ci�U-���S]��'�s"��Ro=l�<������EM�J�|s։xb���!R�>?(�(�ÓLnC�!�(�ɑȎ�G9�m�(����e)R�e���}ʃ�?�4v\aPO�/h��@�ͫN��ܻI���Uch�\&��5D�[{b�O�l��,��t�ٳ_RY���PR֯p�<ۛ8�*4R�1kg�y�.�~����$d��V�9���k##��e�l��j��M/i!W=����q��e�r���QʝVa����b��1Q}��mH}��    �5�7���z�3{�g46� ��ݱ��aV�Tn��^4a��Y�{��~��n��O|�7���6���	lc��M�&.?��X�'-�60�+�&NW7�K��܅#�)@>Kʸ�ʾ]��8��F=2%���J����+�e��0)+�#��|J���~(}Á��?!��V�T=a,�ho�y�.ڞ�,g����l�[��㛹!�C�g���CG��� ���B��6���-�go��qţ�����y	�]��R��X_$N�d&��7E�Җ�:C1-շ
嶔�r|釩֏u�'�
B���P�]ߏ��݁�"�C#s2�i�ᝫ
�Ӿ�^��kǜ֙���L�޸X��Xt&�~1�2��"�%?��r�E�s`I-��Tݍ��N	u�tޖȧt�ڒ�)8�j�p�<�W��U=�T���(U���n�������r���v����GI����Idp�>��@�ٱ-�q�i���a\Jn6;��^e�eb�r�Ǒyū�)Ҭ�����x$ȆW(1�
�Wd�J����=t���n������[Y�V���i1\*3������n
�j�R�>�TW�'b�{C[>[�XL¯��!��۹�-;�| �-Y��xl�偅UZ~�^�,�e)qaK�ϥ�vf'Vy�]*�"�[O����2��YYJy�+�&�R���N����w�t|�E�����&�16���diR���6=����M<�D�����7� �	��k�`�W�U.���\�x������E���Hp�P�y��ζ?Ֆ-|�Gw��j �[���_�&�����gz�ǟIw)��g؃�I��b���)��U]��͙�:F���#�Zr��1>��Ġ�&F�+Zb<<���  � @��Ʈ����e��3RF���_\���������d9�.A�Ɩg���Ɨ� g��U��<¥�Ɯ/���HP@��ʧ,{�WY�2�(�XG��7l����`g� �^��K�{wϓL6��+$�Y�Sݞ���Ղ,%�4��Œ��:/�b���p�4;Hm��� ��؍���qK��������L���=8�^��gĨ@�q&-���cC�v%Ɠ�pC_�����罡dҖ��Ox����Y�0{Ər�g�g��'��1H�q&=��O����#��'|~
@��RY�KÍ��\�!Nq1��~��C��� Ȑ��~c��j#'�K$4��߃F���Q��\6�� :p�=�u��	�q��xMڳ9��קZ}<�.��tr����C�9:�dT�\a����Z WaeɶП��D3�ۺԽk2{�� H��ĠP@s��IPޜt<�n��
�Xe��4�8/Sl�{��CB�OY����.w&#�/1ވ�e�M��ʳĭ��%)ui8׸�sj!���ō��QNn�Y���KY�����P���NJ�F���|�m��A4��FO<��Ӄ`U�P�
�p�Ѱ�ػ>��{S/��ݡ��	\0ݲ�L�E��GǮ:��ÿ���h?>��������q��2�\��D��O��Q7t �k4���~��B��齑k���"����\J���Rw[�Pv�ayh�PY��?�{ߺ&V^�O������	F5�ͽ=ڌ�$�x��P��.ĭ�,����'�Y�^ڔ���	M�uO���)�9H�	<�0�Ώ��F�½j��z�\���]�,�D#?K\�	��B[g��ǳY@߯�V�|/Z���mn
vp�+ȖOea�Y�J-�Wv��~L��|�cy����[��	w��{m��P�<6\��罔��� s��N��g�q�6QP�Y� {+��� K*��Js�
ȍne�X.G����T��ra��B�c����p-��ER���b���r���?5x��ly?v���H)��S
���`Jݍs��q��
M�yh^n���c�t�@t8}#���F»���*�|K:�`��m�gv�?ᩔ���{�ف��z�����)���6o�K���J�5ܝٱ;��.���n!������1��2�~�O)o�7!��=�kB���}eB_���n��râ��*q��ӣ�)�N����/Owޒ�U�׏�]���d�yy��񖕵���p.���f�O��n���}�����b�U.��A+���cR[�\��ҽb��A[�f/_�[Ȥ;Vb�rk+lN����� k��0
������)W7�4�S�ʳ\�}�S.����U.�:�>i�'o�x ��?�����?}��Q��uJU7ܫ�r���6���,�I���;=Z8@ߔ��A7�Az�ֳ���ga�����ic�I!dpi-��6��@��[�c$��=����-Y6��M��B7R�KV ��Jg���� 1��� ��X�X�N�ڤ�'w̷�?va����:��/[���i����s�ͷ���,����p��?Pm�/g��'����]~�e�3�>��� �S��'�G?�NY?&F��u8e�9b�"�AA����;5"����� [ R�8�`�^�l�A�=.(�x'�)v�LH.-�|K.K��_8�Y��a�ܠpxl�lp�%u&���p��:5Ȳ�n�����  �q�����Z�߁C�ߨ�L~�>�E.h+~�S�ā���\X��c��!�3���O9!��Qa��]wV��D������h�[O5�ܜ�����;?l ����S�����������e�G',˿Y����*p`?�qb�;�×,W�~ཝ����&@�����X���q����sY��{AeV-����^��Z����*�������Iᬷŧ0F�?@�ȷ���cpx� Z��%-�Z����zfc����sLv��gÿ��!7z!y�Ku31�]h���վF`?u�b�<A[jlv.? ��Vo��"N(s��B�\tf5���a�K��rn�a�tq,v�T�rdצzA;�8����#�o���|6��x-�8��C2xoW{�]�'2�	�S�>e)6�����I��H��X�w`�]�B t�nb��o������.���;�7k���峙x�~�@�;�9�y���u~��b4��臌);�����8|<�>�����+N����Xp'�g��Uk1<�ɐ<iDr�=��y�l:��:Wh>�jK����>�}���Q#��Ү|��s���#~$æo?'v�2(���狑D&[έa�!q��Af������)k)�Q#��K������M��Ӳ��Gw���ҲvV�AX<�19-wel���.���r���fPҝ��#e��O�[����Jp����j�s=0��b��������~��m���O<���,��c���S�<��)���r@A9X5��ݻ�d���W��fjX���Q�Pz`�}G�ևͿ��{Usጸ#
����5���Zrsv�﷬����,i��%t�91³�E�=���7/�z5�c'�(g�����Ky?'f>z���0!�k�6��r�&v��;nR��l�4�ϼ����K����y,7h�V6� o����Z�w���h�Y&6+T��r���N)�'b!���������'�\�#�TO|�Β{�=��N��8ݘ`��0xr/c��G)#�~���H�N���;���c	�ܫZ�]G�K�^�K�ك���\�xU���<s�y�9
�)w܉q�^v�S-#��y6V��S-�X��9K�]����ȱۏ�6�D�f洁$�Tg+U��LYmؽ�6���{���w��G��'��l���^py����ܑ���A��2��ԡy�[LV#3Rn�����;TJuC��F�ҧ�I#a��:C=Z��V.�+�\X���l�T���(����M���ą^_�\˙ӆݑrb�(��BU|H���v�T�>đ���qWÆ�����n�t Aw:4�|�m0ye2w��sV�	q����K>
q��B��w ���)q�Z��<�Ѳd&	g������\�������[� ��Թ��&N����C?.��R\mn/��e��nN� p  MpJ���~��B�	��U�,�&Np/��\i4�?��,���X-*;[�V�40�&��	�T�#�U�柒z2���p��Ox�"�q��J�H��m }L�g#���%˹q씹z����ke��ϝ�Lʹ d�v���	2Wq�Չ>�Htt���5q�y��zi���s%ćn4�..Gw��%��eη]y�;a���4���cL����	O��ox�ɘ[���eJ�Z-7$��{�fM�ˆ�s�JӍ�)Ct��h���²/S���������'�����5����A�s�^S����h�\gyɘ+%.��Mg�h�xܸȖ.�Ǹi��	&V�lX�왰��<h^��I��^qθ]#�N�{���ȥ1(s略o����G�k�-/X�(�F���b���N�+O\Xƾʕ�B������k�W��o�T���!t�c�uq�v8�υxo�r�ۯ	]��q�I�4/9s�GB�s��E�,,��ʋx |.�`d�c'
�������-�N�|o�<q/��{k�J~zo�Hq��(��M!����[5*;c�S.��ʪ�;�r}w���L�L�6;8s��=�b�3� �?��������(��!t9g'�ū��/����$�8�����9n��ۙM�IȎ�2q�2��g��%en��H}t��s�'��/
�+-77�~:���
WU���ۉi�q捼���LwiL�W���L]�7��n?J�H����Ľ,��)3[��3�3/e>�3��wæ��S
�:X�w`��՞���,�I}����@��%o��H�t����[Y�䚶r���Q����,<�jpXt�ͽ�a�T��B�B�2�B�E@����|�;y�k��S�TH��^�j<}YR���@>Ώr�y<H�}0�I�	���e���41+g����G�����=.�!��/db�������9����\��
����&��Y ir�-^��Κ{7�v+��w���O�v>�ם4���tm'Cd�P�'C��qe��}�^�]<�lϛD-!�"iR����mX��#�6q�ys�� ������G��%s[�\��	'�Ox��	8�V-t2��f���Vȣ@��Xb�Şˍ{���O&�y~��|��as��-�q��c�ppu�猹�@���瘖ct��L�0���,��ʹ�H��~ő��t��]8b<��oJw��%��N8��YC`�e��4��Iy}�<.r�RV�o��O9�U���F$E�,�-ϴ��m�u>:s�R^�xR�[C�s0��w?�7!�zޮ����2}��o���z mz&�T/�r�r��H��%��f��%v��s>�<˹�]�I7�.<x֩��咲��pm����O�wRN7�<��N� O��H$��M�5f��~���^w�\R^��ȍ���N�@���sC���^���+�|G��}6$��\����h�˽>K��t������5�Y�	|l$�~�>��z'����S&��HNy�l"�3���5R&A�[�2�+M���R�0�����c\�a�PX�{ZX��T��^*��ӄ�ray���J�A:_.�(���QX�ީK|�3x��-��;��^w����k�+�'.�����b�rC؍����4q$G�;��XM7-�����|k�,��ע��>���˭��}�rus�>����uXy��p$���(}�'�E��E.���}6
��'��O����^hޔ�xz�9H��r�[_/���&V��	п�`,`f���c�g��7���h곍�3V05�4��j���w����1
χ.�d�9b���~�e�'@�{�G,�qtte�'䞑��#���/��{�����&.y���բ~�ec�{2�7kX����I�]�ۑ��l���{� �t�&>�ܟ'�П�jTV�e?�2@�ԧn������蔹�������!B�y��ZäI�����֊O^�&��~�Y�ߝ0?�m	��[[�����:K˃M���Y.đ2��P��{�U��#���>�l��6��52q�h��vbد<���6H��;��d��WI�Δ{��l((r�8���������@�U:����O����9q!Z~.�s��|N䰋l7��e�'8�"1R:�qC\v)�Æ�ᗴ�sxu�O��cb�	�YnR �E��ͅ��G2�.<'Hvw%��#R��"��4(r�t��F�\�q�Z ���B�o�\�,���M0qA���Z��e�5Q��?:�9���r��2i�D���Wl�X�� z�gA����$M��'uwO���x�	b���c���q��.��c�X���)�X���
�|�H���ڋ�|]6��o�u'ǭ����-����Q��^6il�/Y������'�^p�^�5R�E�(йqǳQ��śY:���ɇ���Ǘ��
9�Ug������y�P�s�]e�h������|�ĽoC���c�>tk$l�ph�B_���/��c��xI2N���Q&x3�F�H�tR\�\�l���Y"<��(�b��� G��X�!�6ҟ 5gt��6��	�ޛ��y�S<y
��Tz�5&�}�++'8�Y(��c�Fd�����'ĝ�c��w��v�X?:k7i����o}+s3���W�Iu��k9���/�h�H��o�����L�2�x�����j�S@�+�w|�G��6������;��v�LH'Ľ�j&��eO2�o����e�H�*o�H>�ד���eBXy���(��|��_�O9�E���v��Ńp>�8�k��e:��:t:�W���2�|�qF٠t,�c@���U���D��p���ʣ�����t��7q
�~`4�4�up�� _w>��R���"���xY�66�ʠ���P�啋$['H{�]Y�:�y0K�E:�C��']�-0���e1q�sR>�Iˉ�&
����(x�Y��]=��n��)���X���O��!����l:S��g�y�	����ՀU�]4���ܷ���{��N����&
��.更�P6\�ݼh㘿�~^�0qZ�kD׍���c/.K��m��z��M��m�N��������B���S����,�q��*+$��vˇ����X�q�:����;�P�4BK��6z+�������).Y.,���<Q���c9�� �|��y5 ���`�@�� �)��M�Ѣ�-.��qY������,�=�u֧?����v�r���7]<�xM�ma!d#��������(,+��֢�ԟ�6����dU�!� �B���[^��^��2nﲍ�� -.��\���秱�U6
7����.[>e�'�)e�}�{�Ϲ韉|���-����vAL��@���Կέ���h�c���cb��A���}~���h]d�?6N�؄������w5cX�O�.����ט�� a+�����>p�2�(���f=�4��Mh�ǯD�x����Rʛ�m$�'�G���+�d�r�q��B��np��e����Sh<=���x
�cr;��A]HZ^l6Q`�d�
���N�$ǽ6
���!_6��x�«d�t�'@)4�N0���MPbc|s��(4��gb��C�;:���A)4�
F����	O�����4 ��:�=����ֆM���l��l����B����>�Hz�
O��1�'[��eYF�*��R�,iy�X`F�`���a�����������^��      s   S   x�M�K
�0E�ySb����BS�h�����I��r�E���Kn9n7��!F$}aZ���<�1�p��Q���wm��>�"\      u   �   x�3�t����=�-;3O�8����Kro+��I�L�2�t��)(���G�7�t�q��g^RT�����Ƅ�9�1nIbi^"�SN� ����f��ޮ>0٩99�E���9=B�9��S�R�@��Ԣ�����8T"1'&���� [�b      y      x������ � �     