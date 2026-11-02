#include <stdio.h>

int main(void)
{
    float dist, vazao;
    float altura_caixa = 100.0; // Altura da caixa em cm

    // 1. Entrada de dados do usuário (scanf)
    printf("Distância lida pelo sensor (cm): ");
    scanf("%f", &dist);

    printf("Vazão na tubulação (L/min): ");
    scanf("%f", &vazao);

    // 2. Processamento matemático
    float nivel = ((altura_caixa - dist) / altura_caixa) * 100.0;
    printf("\nNível calculado: %.1f%%\n", nivel);

    // 3. Regras de decisão e alertas (if / else)
    if (nivel < 15.0) {
        printf("ALERTA: Nível crítico (< 15%%)!\n");
    } else if (nivel > 95.0) {
        printf("ALERTA: Risco de transbordo (> 95%%)!\n");
    } else {
        printf("Status: Nível estável e seguro.\n");
    }

    if (vazao > 0.0) {
        printf("Status: Consumo ativo de água.\n");
    }

    return 0;
}
