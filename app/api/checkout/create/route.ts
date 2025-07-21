import { dodopayments } from "@/lib/dodopayments/server";
import { CountryCode } from "dodopayments/resources/misc.mjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const paymentRequestSchema = z.object({
  formData: z.object({
    city: z.string(),
    country: z.string(),
    state: z.string(),
    addressLine: z.string(),
    zipCode: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  cartItems: z.any(),
});

const PRODUCT_MAPPING: Record<number, string>  = {
  1: 'pdt_cRKTg4DG231iGSfhTBgzT',
  2: 'pdt_r7U7HESRkr0ubNX4qpj2Z',
  3: 'pdt_8SPNHPrEHzw1zCAzyCCNd',
  4: 'pdt_yIwGknmgzMO1pTn9kUDYa',
  5: 'pdt_0MG3kiOrm33aqBXbTPFgC',
  6: 'pdt_S4lUrhC8N6b6BGTtf1oAD',
  7: 'pdt_drF6Hzf8VuMHD6eAsSUS9',
  8: 'pdt_67RcdCoUGaQMUrV24dHQf',
  9: 'pdt_4riXCk2KaxMauVEZWZyRt',
  10: 'pdt_YcaK4nd7zO4fxlv6xN4Hd',
  11: 'pdt_F9v5qZ6GqMGNi4bf1Y2o6',
  12: 'pdt_IIEY3wnIWiS75jdsm6eHN',
  13: 'pdt_YpXRFitOCye0DKhEd1dbB',
  14: 'pdt_wBK6yB1FEGBGOcHwSKSK1',
  15: 'pdt_r1Ftg40dSyxinYxPW59uM',
  16: 'pdt_Xiw5pFfiJU9ac9z8FkHpO',
  17: 'pdt_bgioJdSzxIzczzbR5vaWQ',
  18: 'pdt_N8nxbRg67wXkZuWG0FVJ9',
  19: 'pdt_gfFU2SRcPYpY5Liqj6V1w',
  20: 'pdt_kNewQt5BfrSG1tymt3BXE',
  21: 'pdt_t5VfCF8s71fqHgHsvphIy',
  22: 'pdt_Xr5xQBswBq8jtCpYgIC9H',
  23: 'pdt_XyLK8KG71BXOWrevHDPlL',
  24: 'pdt_xUyF7jM9fHl3m7NnT0OWd',
  25: 'pdt_PAIxGMfYEP3l3zjfFuI4g',
  26: 'pdt_ZdnbgqrvbpZmDd4NbYQOD',
  27: 'pdt_4E77BcrwU0wkvX6oCk2PK',
  28: 'pdt_YvXOCljzhlPZibS6Jjr7Y',
  29: 'pdt_tMhQrrLSrSpHfPhpUyqfW',
  30: 'pdt_etJmJ1BSxZho5YADt6Cxc',
  31: 'pdt_KbnNzjjBIvaWBYOROeS7C',
  32: 'pdt_NL7FmLtkVUOQTJVSX2beB',
  33: 'pdt_Dh7qJYqM9Be77nxm2qjRz',
  34: 'pdt_VBMXAB33zYIG2ofgtEkES',
  35: 'pdt_MtDSqSmKcpOmpTsyfyPde',
  36: 'pdt_Ur3OtGs2yPVL3nf9uuJWu',
  37: 'pdt_3Ezz1PSBPSbhgubbheyAB',
  38: 'pdt_mgmsOwO2us4X0xKedssNm',
  39: 'pdt_MaeDWo7F3TKKtcv07b14A',
  40: 'pdt_toqnxA3DVDFN63t4kZ2fD',
  41: 'pdt_WLUqNVs3Qtimlti5oiETH',
  42: 'pdt_MbWAGwbTzk4I4CPu0NYTQ',
  43: 'pdt_Vi9Aznk3qOWwE6rUqvG92',
  44: 'pdt_RHW9LX83KdAnm8fbGkumP',
  45: 'pdt_ciA1RoufBc1nHOBygJ5p1',
  46: 'pdt_3SzjjwvejLDtjJtFPj7UE',
  47: 'pdt_N8SkSY0JG1VNtOg0ORlz3',
  48: 'pdt_p1WVJe9sR7sMfbQ5bAHyQ',
  49: 'pdt_XdSEeTmX7T6144re5wgup',
  50: 'pdt_bqWW7l5GXBPWbEP97la0C',
  51: 'pdt_T8SXmAbpLMvBeQEtzLlOo',
  52: 'pdt_WTl4FhQBiI6qrkejHpvNg',
  53: 'pdt_mU4A5hUTVYyob9nXYygu3',
  54: 'pdt_kGZnT1QZIArOFh9IBVkxa',
  55: 'pdt_3rdW45xUbK8SL5GpmVJL5',
  56: 'pdt_RFOT1s6nY6GXcsFbswSa9',
  57: 'pdt_SkmyaZPAvHNqxmZXwfuRN',
  58: 'pdt_tZL3mgIvXY3O9yu4hVT9T',
  59: 'pdt_kVzTo5XWWQNXwQUts1BU2',
  60: 'pdt_syYZ7iANWs35HkWab231v',
  61: 'pdt_OXuESo4AAWJ0OQz9Xx4td',
  62: 'pdt_z0LTTh10kviFWNjD1EqOj',
  63: 'pdt_R1HU9uT5fgAMK1IwNoHkQ',
  64: 'pdt_D5YNmJRnD0rhIbgzusW8w',
  65: 'pdt_KRLIkpMwN9ucbSzR5Rq78',
  66: 'pdt_OpCIa25AlDGN6dDkvAyJ1',
  67: 'pdt_ngiJOYiHHword0QtSxpE1',
  68: 'pdt_0lUB3gNOcreeUzeTCvXAQ',
  69: 'pdt_jwwwGTaXZ9MGMdLZcrmVV',
  70: 'pdt_ydW9a6TB996Vi5mOBrLPO',
  71: 'pdt_aV5z29IvVvVAcloCnPMV5',
  72: 'pdt_ns4x78TTsmgQsC2HW7VsS',
  73: 'pdt_Vjb2uE7B3ppL7yWVZWVUE',
  74: 'pdt_t1gVrbVo5qvGAbPRRlYrj',
  75: 'pdt_iC2YrsYd0VicaO3yTlytk',
  76: 'pdt_meXqaWcA5sbqDS8qYou1G',
  77: 'pdt_yEY8T9ds19hgRjzzk2LLR',
  78: 'pdt_mlt8PhHM7tPqvh1MRs2mM',
  79: 'pdt_JWCuRLTclDtdn42WEzzRp',
  80: 'pdt_p61ibQ838iYGOcvEXs03O',
  81: 'pdt_BkeMiZ1jO5BO6zOcHncRe',
  82: 'pdt_l0JpnWIsmP8wQhpeR7thm',
  83: 'pdt_ACzGvKmElHzpzmoonDBAp',
  84: 'pdt_6wXLUNdmOfKtonbWwqRnW',
  85: 'pdt_pGhxCv3UaKgHjrqD5yxGk',
  86: 'pdt_yxoTnnTYacVKzVQAR1xh1',
  87: 'pdt_8qHvtQVuECXExGJ696pOz',
  88: 'pdt_4zcdDol175GDrBRL45uL9',
  89: 'pdt_0OYGjo7JPsE21dGc266Yg',
  90: 'pdt_2Tha4IVTVKje5vxpSa4mO',
  91: 'pdt_iziGUtv5btotpk9T0IN2O',
  92: 'pdt_rAKZ1PT4uHOeW67cWHEym',
  93: 'pdt_Ha3HlPjumtzGKXQp2LjQh',
  94: 'pdt_xAePLBtvNYy5ZtGbCOHqP',
  95: 'pdt_HtoYsOCFI2epZKax7AAWl',
  96: 'pdt_BIPebk4rjMnYCRjqUq7oR',
  97: 'pdt_U78MIRpTQrDSgLzVZ0hUB',
  98: 'pdt_0TbcAns3gQooPEYW8nqxV',
  99: 'pdt_B02YsJY29Ys55adwCOkz9',
  100: 'pdt_N2PijTUpYWVHtG7bibxUR',
  101: 'pdt_TOQWWapPebEOjkFPSCkxQ',
  102: 'pdt_yapr8KJsoOHmpyzSGp5qZ',
  103: 'pdt_1MzcHkY9YT4yaW1xC5rxY',
  104: 'pdt_wT8tnRgMwWxcUJX9Obi7m',
  105: 'pdt_w5YOhJuXzzYgaGMdONPrn',
  106: 'pdt_tivNnFyK2mFPvFQpeoEAs',
  107: 'pdt_VQSgwVegXZeYiOlHg1Jx4',
  108: 'pdt_i1FKA4wMG5KJ4wG1Y2JoH',
  109: 'pdt_JalGRp9dHTagEyKiQFfIO',
  110: 'pdt_bQganOS4wtRE3lLtiVyiV',
  111: 'pdt_OhBWjWKbRQcy7ffdFxZhf',
  112: 'pdt_BwenGSA2KoLWX7DuumDrw',
  113: 'pdt_sGsrWuLTwhqa48ZPcHkac',
  114: 'pdt_kKJtSlo1rpIJOt9duwKH7',
  115: 'pdt_5Ucaqv5W84KWs9jY7JZJY',
  116: 'pdt_OdRe6oNiMY3mmzyKYqiXv',
  117: 'pdt_LOH2WCSbjHKIAEqbuIXC9',
  118: 'pdt_weg83dwuLsDrEcULs2qUi',
  119: 'pdt_JxVlJz98bMvfM049iBPVK',
  120: 'pdt_QyRLyjSrh5NCfWkumyr8P',
  121: 'pdt_aJj8WsbxueS5KAGSkTORF',
  122: 'pdt_jAG3P0D6Wn6HVojv0FsvS',
  123: 'pdt_4debKZ05bB6BeV3VbXwe3',
  124: 'pdt_B2pVnYx7osVDZ5sUaP5j2',
  125: 'pdt_iwEHytFDV3oJ24frn3ltt',
  126: 'pdt_0rntSn4BFyusKDEBtDkod',
  127: 'pdt_zPwwmexfLI2vbsUnzkqjx',
  128: 'pdt_9QftAluOPujE31YIrTT10',
  129: 'pdt_qZz2Wg6wyGa44MNyBK9AC',
  130: 'pdt_VXHdVMJhoN0Ra6ZFgxPNI',
  131: 'pdt_FPxGJ3wn6qzv8B9cbS3v5',
  132: 'pdt_EHur9rmezm3bG0TWGeGbX',
  133: 'pdt_v5ELq2P3CuTsy9iLbuzPD',
  134: 'pdt_fThSDsVAfyWmfBa3764h2',
  135: 'pdt_1k0ubLnxOkhowvCuX7Kfe',
  136: 'pdt_pf8qUqBIaPXGF3nAkyqX1',
  137: 'pdt_USrZZEu30xluB86cWRCSb',
  138: 'pdt_sXvwpp4CbZqd4Hzr60XDb',
  139: 'pdt_4bULxJbNDVDCMZa3oL9nG',
  140: 'pdt_pSfAehNQ7CgrZc91sTS57',
  141: 'pdt_zRYIMhbgHMrf1hxLy5qVm',
  142: 'pdt_3w4n5S52pcMIV2Bpxlbd7',
  143: 'pdt_2cHthpxjU8dFvoxnpZd2H',
  144: 'pdt_emqRgsxDJg2Zg4dDO8JlX',
  145: 'pdt_8yusMCv5Ih2VquZ0aeIFK',
  146: 'pdt_QBFnfM8NtGdOxbqct81QB',
  147: 'pdt_gekdJdZQn0jagm00FEwqB',
  148: 'pdt_JjJY2AU15a5NYtUrw4cdA',
  149: 'pdt_YUk89WByTPPxbfaGv9ovS',
  150: 'pdt_Vj8MR4s5kYlZUGJEPLxzs',
  151: 'pdt_kYWQWSaN5seLi2zpAHqwT',
  152: 'pdt_H3zim44K4TWPXy0tt292a',
  153: 'pdt_4P0q8xdEewKhelJCrfSbZ',
  154: 'pdt_6FYFFUrHnIzKyiJNeY9Ts',
  155: 'pdt_zFfJwjb2X4kwls3QyxX3M',
  156: 'pdt_A4byhOoNa7a47tIUla4VW',
  157: 'pdt_3n9Ph8GN9IDafRJ9fXg1s',
  158: 'pdt_jPO72LAWVBJZ0N7mXHKlL',
  159: 'pdt_1G2GvByaKhclSFFzHeCsx',
  160: 'pdt_zCXpZ5odLPADn30YyFr7E',
  161: 'pdt_hikhLXfLdqHpoBZxR8fBn',
  162: 'pdt_yCfbIfp98XUoQ19U50Wzt',
  163: 'pdt_b3rVO0IhanAzdVRadZhKx',
  164: 'pdt_mh8mtBVQtMgrMoi0tioMm',
  165: 'pdt_NXScLowGSWJAqie3QpggD',
  166: 'pdt_FvfoT9kTwXeFxZK4TxQr0',
  167: 'pdt_jWUP4n7qRo8HEU0iGmnjY',
  168: 'pdt_ABGEkhk9D5LWRzXl6dF4g',
  169: 'pdt_U0atdClI4DiE1lbzETYpx',
  170: 'pdt_SId3rVcPE6BUyGIqL4E7y',
  171: 'pdt_zwKFVYOOZRhNIPZUWlL46',
  172: 'pdt_vXBZwap2Om9zAAgqqkn2G',
  173: 'pdt_3ZslC4uksYH2lXd0J36Cr',
  174: 'pdt_VHEpcs2cwJeAbqO6xEoe5',
  175: 'pdt_ydzYUgjpyEuW3EWislh3J',
  176: 'pdt_aOEyuWjQ2qHeIP8Pyjlft',
  177: 'pdt_94IT2egNJ46jUXy8hJQ0n',
  178: 'pdt_PIJ3YnLAhCuW2Y8xxTUMW',
  179: 'pdt_3rTYhcP8oyFngvcdWbhWm',
  180: 'pdt_WiEKOXjY3zyxvliYOvu81',
  181: 'pdt_x8PHQ3PYGmbHkjFi05CEE',
  182: 'pdt_aKvAgU2y3CpUIAxFmNAAW',
  183: 'pdt_uXpP6psLYw6ODdfJhra1b',
  184: 'pdt_D0wp6Jg58LHqvHHoRUjmf',
  185: 'pdt_16xPqK258Z7UCwf9OpsHl',
  186: 'pdt_C3TTTyq1gWQEqdHu9oU4W',
  187: 'pdt_dDg7fk55Zrq9uOyhxTOgK',
  188: 'pdt_SWrRv6n5bNeysFZ1SxB6m',
  189: 'pdt_i1fVwD3MMEzyr7T7M77Rk',
  190: 'pdt_RlGeloZpCxn3eR4MOqA1i',
  191: 'pdt_QHMgvyChOcxeo8OW679t1',
  192: 'pdt_kEB6pv3uqeOgHwWsh3REJ',
  193: 'pdt_21W26YFSLxuH4eC7mrCNC',
  194: 'pdt_mvu6AI3IS5j5IddAabkhg'
};

// Helper function to get DodoPayments product IDs directly from mapping
function getDodoProductIds(originalProductIds: number[]): Record<string, string> {
  const productMapping: Record<string, string> = {};
  
  for (const id of originalProductIds) {
    if (!PRODUCT_MAPPING.hasOwnProperty(id)) {
      throw new Error(`Product ID ${id} not found in mapping`);
    }
    productMapping[id.toString()] = PRODUCT_MAPPING[id];
  }
  
  return productMapping;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const { formData, cartItems } = paymentRequestSchema.parse(body);
    console.log("createe Original cartItems", cartItems);

    // Get all original product IDs from cart
    const originalProductIds = cartItems.map((item: any) => item.id);
    console.log("createe originilProductIds:", originalProductIds);
        
    // Get DodoPayments product IDs directly from mapping
    const productIdMapping = getDodoProductIds(originalProductIds);
    console.log("createe Product ID mapping:", productIdMapping);

    // Map cart items to use DodoPayments product IDs
    const mappedCartItems = cartItems.map((cartItem: any) => ({
      product_id: productIdMapping[cartItem.id.toString()], // Use the mapped DodoPayments ID
      quantity: cartItem.cart_count,
    }));

    console.log("createe Mapped cartItems for DodoPayments:", mappedCartItems);

    const response = await dodopayments.payments.create({
      billing: {
        city: formData.city,
        country: formData.country as CountryCode,
        state: formData.state,
        street: formData.addressLine,
        zipcode: formData.zipCode,
      },
      customer: {
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
      },
      payment_link: true,
      product_cart: mappedCartItems,
      return_url: process.env.NEXT_PUBLIC_RETURN_URL,
    });

    return NextResponse.json({ paymentLink: response.payment_link });
   
  } catch (err) {
    console.error("Payment link creation failed", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}