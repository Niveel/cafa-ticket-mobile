import { StyleSheet } from 'react-native';
import colors from '@/config/colors';

export const markdownStyles = StyleSheet.create({
    body: { 
        color: colors.white, 
        fontSize: 15, 
        lineHeight: 24, 
        fontFamily: "iregular" 
    },
    heading1: { 
        color: colors.white, 
        fontSize: 24, 
        fontFamily: "ibold", 
        marginTop: 20, 
        marginBottom: 12 
    },
    heading2: { 
        color: colors.white, 
        fontSize: 20, 
        fontFamily: "ibold", 
        marginTop: 16, 
        marginBottom: 10 
    },
    heading3: { 
        color: colors.white, 
        fontSize: 18, 
        fontFamily: "isemibold", 
        marginTop: 12, 
        marginBottom: 8 
    },
    paragraph: { 
        color: colors.white, 
        marginBottom: 12, 
        fontSize: 15, 
        lineHeight: 24 
    },
    bullet_list: { 
        marginBottom: 12 
    },
    bullet_list_icon: { 
        color: colors.accent50, 
        fontSize: 8, 
        marginLeft: 0, 
        marginRight: 8 
    },
    bullet_list_content: { 
        color: colors.white, 
        fontSize: 15 
    },
    strong: { 
        color: colors.white, 
        fontFamily: "ibold" 
    },
    em: { 
        color: colors.accent50, 
        fontStyle: "normal" // ✅ Works with StyleSheet.create
    },
    link: { 
        color: colors.accent50, 
        textDecorationLine: "underline" // ✅ Works with StyleSheet.create
    },
});