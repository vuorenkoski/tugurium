PGDMP     !                    z        
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
    public       tempviewuser    false    200           s          0    16386 
   migrations 
   TABLE DATA               *   COPY public.migrations (name) FROM stdin;
    public       tempviewuser    false    196   �+       u          0    16393    sensors 
   TABLE DATA               P   COPY public.sensors (id, sensor_name, sensor_fullname, sensor_unit) FROM stdin;
    public       tempviewuser    false    198   �+       y          0    16420    users 
   TABLE DATA               C   COPY public.users (id, username, password_hash, admin) FROM stdin;
    public       tempviewuser    false    202   �,       �           0    0    measurements_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.measurements_id_seq', 508, true);
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
       public       tempviewuser    false    198    200    2802            w   v  x�UZ[�e�
���K�X
����������ى ���=~��3���?U���!c���� �~�|_ �3�E���w��y������ sg��Z����3͡ݐ��ܗ^�1�?���̓i�c�a}T��>�����[csD2䍷��#l�c�`Z��-}�xD�3������ǒ�	��?�M����$������Y5�)`�`�v�,V%y*xU)l���\�i�;>v�}��]�� [�(U��ab�j�7}x���ӯ��b�ѱ�j�������桳baP��5#W<�W���ba[.r�2z<��X^�+�ೕoF�X�'�>��ґ��Vck�Ȕ|o��MΓ����(l�m���<9��;~7&`�׈L�r�Y�m�S�N�c�`k{D�$�x�v���|�BƳ��b�<����x���s+��v�(V�K�w1)�r�g��#	M��8���Λ�-�����D?�d�6Q�|�7b��ݍX�0[�_�I���y�J���F��t��V�/2���~]��ێ��b$�:���L��yg<&x^���)�ˉM�5�Ȕ/�w�����[xi(D��y��L���e�ҟߙ�)0u1�l#�3�W� � �B���,R����5��\������E�L��� }B��4��%ܸ������t
mU8�m]04�}�N|�5uz�4J0�������j�'�[{���9����N��z�r�%���&���������2��#�9���옼���f���;����{�����6��{Js{D�0�*���'G;&o�ϜM3y^����I�@ϰ^�e���Kp��۽S��w2@��� 
(�L�7L�jScZ�s���y����2������RNL�NP(� �+S����)˱�M�?h��'��@[�D��:sEx-���Z��tX�$�I�\0;���{=�	I&���`��>���\���E2�~�wڦ�����労���3�~, ��P�`��6:`��)�����
a\�qI���;|� ���)���b���`nę@٘k�ՖTa�ٍc�P�8����r��=�B�nc0�3��a�n �؟�;�X��'{�/�I�o��:x�"k�` Q� ����h5ݡ�tf �N0�L���B�jS�51/Ԩ��@B�@]��:jM��{\�4�����L���Q����D������<�W����ſ#��m��|���7܁�j����/���L����;��7�� x�1l"8�!/�9r�����c
2�ؗL��S:$��r�w���4�#�czSG�e���8��Ño44�L��`�;�w%�}8&���W{߯p���vO�	���'x+�1��Ks?<��$dR3]<7�}��r�����9%�u^#`�犹8h�h�����]����f�=��!M�<��f��c���܋��܎��̸���#��C�e{��k�$���h�9)�I�yn�ߋ^���A�����[K���\5���gF�Z��0^Gƽ;�Z�N�;�d�	$_��AGҪc�1�UǊ�Vc�	FH��U�\|nnl-���U�\�Ȭ
6���r����֒����|�ّ/�&���!ncC����^�,�k ��Z��N�u�xym����Ĉ�kKk)���~�3G=A�%e�e��qU�P�E1l�ʥ/l��E��IkM�㏃�5}a﯍x����buԻ�����)��<�Y�S���2�{�6&4nAm����!�WöQK7��n�!��c�I9��8Bnly���r�|�C,������߈�0���P���V��l;���}�+�Q�Q; 7s"s5��tC�2�0_���A��z��v0_�(��1_�C�y�2�1y��h`����������LAf)��B�֎ͭ���ϑm����\/��@Y���g�ͻ>�Xm��Q�F9Km���\�|���9�>w31t*�ļS�j��eN�[IW� �Vy/G�	����N-/��I�|�z�dm՜����rpĳV�Q��J����1������L�'�p�b�O2���C7Ƭ������;h�n.�u�����V�0�|W&��_���7�*ܨ���J�?�E���1��ZXcV�J^��E�0Q`|�
�ZV�?/���P*��Q��sy-��ߩ2��N�xY�{��[R�?Ϯ�O�˒�lkk%�l�����}_H0����*m��q+GqkjW��=^KdOtb�d�xVߔd���u���[Ls��$��ݪ����,���d/�ݪ�Fy��Uc/�֪�+�҅��O���N�p���γ��.I_N{�6OB���hU��{![i˛��p�`�0���M�Ǘ����l4��ǣ�陯|�<�y�ɯ�S���j�1�W�9�x�<~~KD<0�Q���5���4U�q���K������,��4	�y2V~��	]F�(��ri�rz�D7��L|~m���ǃ�P1�	�O&���y)��)^f+�&2�����#jv�k��S�gc�?���%E����l�wjQ�ZV���:4y�D��2�1c�U�W�?`8Z0MWs��"�_0>�Ę�YN8����y�V�E�V�`�܊�{�\��[
k�����W~�m�SZI�P�7��g�������j�����¼K�kaޥ���
�B�6��W�h0W�&���:��HJ)�E�w�,N���.N�����{�(NQ� Ѹզo�yפ���w���|�����LBfkh�P����x�Ϊ���^�cL][X�&��w�0绅e��?���7�9�[C��5d���2x�,0�ϼߠ����(v���>�l��Y���d%8��)ˡ��J^?/8�'d��a�Or$���m���~�vp�yNhT���F���������?�Vx�      s   S   x�M�K
�0E�ySb����BS�h�����I��r�E���Kn9n7��!F$}aZ���<�1�p��Q���wm��>�"\      u   �   x�3�t����=�-;3O�8����Kro+��I�L�2�t��)(���G�7�t�q��g^RT�����Ƅ�9�1nIbi^"�SN� ����f��ޮ>0٩99�E���9=B�9��S�R�@��Ԣ�����8T"1'&���� [�b      y      x������ � �     