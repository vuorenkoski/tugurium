PGDMP     .    -                z        
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
    public       tempviewuser    false    196   �-       u          0    16393    sensors 
   TABLE DATA               P   COPY public.sensors (id, sensor_name, sensor_fullname, sensor_unit) FROM stdin;
    public       tempviewuser    false    198   .       y          0    16420    users 
   TABLE DATA               C   COPY public.users (id, username, password_hash, admin) FROM stdin;
    public       tempviewuser    false    202   �.       �           0    0    measurements_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.measurements_id_seq', 595, true);
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
       public       tempviewuser    false    198    200    2802            w   �  x�UZY�^�
{��K�:6�a/w����~H����x��O�~ڰ��7��i��!�O�ׯ�A�#���@짵������i�"�����Az����fA6��?�w;� 햐����Uß{����f�c�0>)L�vl�[}㍶4"i�����ñv�Y�$[�4���D����][d�#�Z�:������Tb�]��j��B2j������m�Y�Jr��uZa�l��5��y�ǪՐ���*id�?I��j�O���Eh5��}x��Ǜ_�'��<b�՘M{dJ��c��EIU����Ƽ�O;�'�
��p�+���iŧ�r?�bq	>[�z�J'�񭳺�Ihj �G��{����y�;��
�dᅭ8�6����K
3�]�E�l8���ś��lĲ�v�����1������8�,�=�վ(&�����>��ݜ|��S��=���0�]̊7�l� �ДL����~��,x�� ��2?�T�6Q�|�7b��s��YaB�������.�*y����#�A���"S^ʿ��%����ɀ/Fb����տ����w��`��黙�X'�-;2��ݵ��<��?�^
�g��~G�|���Ś?��3�ݬ�����6��x�������Pv#�w����w绥"��8`�����Hֶ �V�>!�YnC@��-ܸ�
�> ��� �{T8�m]04�}�kN|��zM*4��O,P��ZVo���t���_|�fPO��	v�AO\.��|2�p�Ŀ ^���hk@�5o�;��͝���Ў������z)�w>OG��������{I����0�*��ȓ�����3�=3y^���XI�@ϰ^�U���Kp��۽S��;�^�k�IL�@o�L��ƴ��D�+���%jd��3�JǸz'(Th�=G�л��S�cA�?(���x��D��:sEx-���n��@X�$�I�\�}P+�6F%��@; b�D����M���N�sA"*��e
}?��MG��������\ÙB�u T�0:�6`xeʭog�D�&�D\:<�
�1�1u!�6^^6�&�o�L�-���j[��LG�h#T�hy��9�\:�G��ц� mj�p(}��A�gGic� }����K��K��6���d�4��(}�����h5�6��.�� ����D2�S^rt����yY����d�x��b���j�uͽf������=�pՎ.N7/t�1|yx�0�->����F��\���A�:��o�#�����/���L��l�>6��k._+�M�;�g��;���pP�#��ֻavP1�1ӷ}��y�1!ͻ/wpz����+�c���T�Qv����P}`8���%��?��̳�}<�b�����+��*澻��{��.����Ks�<f�`
3L��'^��`>h���X�5���������r�9��*u�O��8��3�Ι�R]Ͼ�c�4�{psP�h2�����z`9��|��,G����Xڅe#�t2�/�؅5���=�%��bl.�>�Z�w=��if?3RhI?3��i�h� ��\.�g��ľ���J��S�1���L�N9�#���U�\|n�-���U�\�̬
����r���h�h��`���ȗ	�ٹ{pHa��g�{�� ��hB^���e@GC�����ٽ�q0:K�8���dc�h��=s����[��_�/n�/Ts��D�/�9����hm������^�'��3���wI�y�g\M1���feO��K_/�5`,lA-����yQبW��ޭ�*N��n�f��9�m�$����̃n�����7]��޳��z�#Ba���B��Pؾ�v(����W
����
fg� S��F�en�|��Nw&�[����y�%�G�y�`N9��˼ч��$%��oU��.�4�+3���R����7M6�0_Ok�[�it"0/p�(�e�w�C�6��<b�A�K�e/�y/gs��`�	s�/09t)I�K�H�j��e.�͡$��d�Q����9�%�搗p��^&�׫W*�T�U��y/'G�k��ŭPR�_�Jn��'��&��OR� �O2���C�Лr�ua�M���v��@77κU�F|�Td�<�*�G}��p3ȍAE��ͼ|��W�6�����טa�V�
�6�{W�Yy��<�g�TFm����� ��ޮ2��N��3��y?�͚G�����v~]V����ƸQ��0}AO�i���3�:��C9�?͉J��ǃDVg'��,��oכ���V5�8N�Ĵ8�%i�\/�f��3�<s�i��T���o�f�\o�&��J�����͋wكǃ��w�������/�ۓ�.�s�U��{!�Җ7��p�`�2���M���rK��6
��x�<���х���|-P�����}o�Q�μ:�i������["��!�jv�H�i\���d�"�uo�40ߣY��4I�y�F>gh��n�d�����|9�c��Un:�?b��x0'�s�T���7��r4��eB9ҙ9�v�G���|�S�ҳ���?��������I�wλ@T�yȊމ�M�wL6��T�Y�H�3/PQ-���h�4]���|-�`<�Ę�Z�4����yW(�ۢ)g�Bq�y�����鄹�9�d���.���%C�o 4/z�$-%>������o����58�yy������7�9��Ḿ�4?fBG��A��Iw��:�����������q�]�7@6�����6������vp6��E6��Vg��)̄�� ��	���Z�9��kt�ɡO+�����6�|AX��{��G��s��ʎ���Z_�Ц[������*v|���rGʎ��6z�%8�xJ�g��e9��_���;�yB[`�&~�c�]��m0������:������7ۗ�,/w����
�0��îe�����O��;�Tf*��Ls<��w^�����O�-�:��̓�-�u��l�fH�����?_�N{�O,1��Sj�1yJM1�8b�[
1���Cc[�hLhp`H�P+%{M�0Kɖ��Fyf�>���x&n�M��Т�����wM���̣�c�\0��Mx�p��m�=A��k����x�|����v�	U���MyJ-z��%.L<zl_��t�=�W��`���^~��-�����䝓Ǆ@���@;�.�o��B��Rh6O��ٟ5�x�Y��Ak�g�xP��6i���O�	-�������,�"���6�L	<%�@ǟ5��	�G?x�p�o��� �q�����lP?%N��A�y�|�+{�M��J���K?��N����3�"��\{/aY@s#p<�O<�Ѿ��1���7�c�q�x�x��k9�Pb��9Ĺ�x�s����r��K�c?��E�?���/�w�&��ϼ���w*�{�1!��S�Zcn^�9�Zl^�9����O�?Srfր�gJ���������K��      s   S   x�M�K
�0E�ySb����BS�h�����I��r�E���Kn9n7��!F$}aZ���<�1�p��Q���wm��>�"\      u   �   x�3�t����=�-;3O�8����Kro+��I�L�2�t��)(���G�7�t�q��g^RT�����Ƅ�9�1nIbi^"�SN� ����f��ޮ>0٩99�E���9=B�9��S�R�@��Ԣ�����8T"1'&���� [�b      y      x������ � �     